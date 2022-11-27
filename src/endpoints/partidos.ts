import { APIError } from "../error.js";
import { verificarData } from "../common/helpers.js";

export default class Partidos {
    /** URL para o endpoint dos partidos. */
    readonly endpoint: PartidoEndpointURL = 'https://dadosabertos.camara.leg.br/api/v2/partidos';

    /** 
     * Retorna uma lista de dados básicos sobre os partidos políticos que têm ou já tiveram deputados na Câmara.
     * 
     * Se não forem passados parâmetros, retorna os partidos que têm deputados em exercício no momento da requisição.
     * 
     * É possível obter uma lista de partidos representados na Câmara em um certo intervalo de datas ou de legislaturas.
     * Se um intervalo de uma ou mais legislatura(s) não coincidentes forem passados, todos os intervalos de tempo serão somados.
     * 
     * Também se pode fazer busca por uma ou mais sigla(s), mas, em diferentes legislaturas, pode haver mais de um partido usando a mesma sigla.
     */
    async obterTodos(opcoes?: PartidoEndpointOpcoes): Promise<DadosBasicosPartido[]> {
        const url = this.#construirURL(opcoes);
        const dadosDosPartidos = await fetch(url);
        if (dadosDosPartidos.status === 404) return [];

        const json = await dadosDosPartidos.json() as CamaraEndpoint<DadosBasicosPartido[], PartidoEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosPartido>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** 
     * Retorna informações detalhadas sobre um partido.
     * Caso não exista um partido associado ao ID fornecido, retorna `null`.
     */
    async obterUm(idDoPartido: number): Promise<Partido | null> {
        if (!Number.isInteger(idDoPartido)) {
            throw new APIError(`${idDoPartido} não é um ID válido.`);
        };

        // Garante que o número seja positivo.
        idDoPartido = Math.abs(idDoPartido);

        const url = `${this.endpoint}/${idDoPartido.toString(10)}`;
        const dadosDoPartido = await fetch(url);
        if (dadosDoPartido.status === 404) return null;

        const json = await dadosDoPartido.json() as CamaraEndpoint<Partido, PartidoEndpointURL>;
        return json.dados;
    };

    /**
     * Retorna uma lista de deputados que ocupam ou ocuparam cargos de líder ou vice-líder do partido,
     * com a identificação do cargo e o período em que o tiveram.
     */
    async obterLideres(idDoPartido: number): Promise<LideresDoPartido[]> {
        if (!Number.isInteger(idDoPartido)) {
            throw new APIError(`${idDoPartido} não é um ID válido.`);
        };

        // Garante que o número seja positivo.
        idDoPartido = Math.abs(idDoPartido);

        const url = `${this.endpoint}/${idDoPartido.toString(10)}/lideres?itens=100`;
        const lideresDoPartido = await fetch(url);
        if (lideresDoPartido.status === 404) return [];

        const json = await lideresDoPartido.json() as CamaraEndpoint<LideresDoPartido[], PartidoEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<LideresDoPartido>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL(opcoes?: PartidoEndpointOpcoes): PartidoEndpointURL {
        const urlBase: PartidoEndpointURL = `${this.endpoint}?itens=100`;
        if (!opcoes) return urlBase;

        let url = urlBase;
        for (const [chave, valor] of Object.entries(opcoes)) {
            if (chave === 'sigla') {
                if (!Array.isArray(valor)) {
                    throw new APIError(`${chave} deveria ser uma array, mas é um(a) ${typeof valor}`);
                };

                for (const sigla of valor) {
                    if (typeof sigla === 'string') {
                        url += `&${chave}=${sigla}`;
                    };
                };

            } else if ((chave === 'dataInicio' || chave === 'dataFim') && verificarData(valor)) {
                url += `&${chave}=${valor}`;

            } else if (chave === 'idLegislatura') {
                if (!Number.isInteger(valor)) {
                    throw new APIError(`${valor} não é um ID de legislatura válido.`);
                };
                url += `&${chave}=${Math.abs(valor).toString(10)}`;

            } else if (chave === 'ordem' || chave === 'ordenarPor') {
                if (typeof valor !== 'string') {
                    throw new APIError(`${chave} deveria ser uma string, mas é um(a) ${typeof valor}`);
                };
                url += `&${chave}=${valor}`;

            } else {
                throw new APIError(`${chave} não é uma opção válida.`);
            };
        };

        return url;
    };

    /**
     * Obtém os dados da próxima página.
     * @param links Links para navegação entre as páginas.
     */
    async #obterDadosProximaPagina<DadosDosPartidos>(links: NavegacaoEntrePaginas<CamaraEndpoints>[]) {
        let dados: DadosDosPartidos[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);
                const proximoJson = await proximaPagina.json() as CamaraEndpoint<DadosDosPartidos[], CamaraEndpoints>;
                dados.push(...proximoJson.dados);

                if (Array.isArray(proximoJson.links)) {
                    const dadosExtras = await this.#obterDadosProximaPagina<DadosDosPartidos>(proximoJson.links);
                    if (dadosExtras.length > 0) dados = [...dados, ...dadosExtras];
                };

                break;
            };
        };

        return dados;
    };
};