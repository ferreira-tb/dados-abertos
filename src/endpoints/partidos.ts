import { APIError } from "../error.js";
import { verificarData, verificarID } from "../common/helpers.js";

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
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const dadosDosPartidos = await fetch(url);
        if (dadosDosPartidos.status === 400 || dadosDosPartidos.status === 404) return [];

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
        idDoPartido = verificarID(idDoPartido);

        const url = `${this.endpoint}/${idDoPartido.toString(10)}`;
        const dadosDoPartido = await fetch(url);
        if (dadosDoPartido.status === 400 || dadosDoPartido.status === 404) return null;

        const json = await dadosDoPartido.json() as CamaraEndpoint<Partido, PartidoEndpointURL>;
        return json.dados;
    };

    /** Retorna uma lista de deputados que ocupam cargos de líder ou vice-líder do partido. */
    async obterLideres(idDoPartido: number): Promise<LideresDoPartido[]> {
        idDoPartido = verificarID(idDoPartido);

        const url = `${this.endpoint}/${idDoPartido.toString(10)}/lideres?itens=100`;
        const lideresDoPartido = await fetch(url);
        if (lideresDoPartido.status === 400 || lideresDoPartido.status === 404) return [];

        const json = await lideresDoPartido.json() as CamaraEndpoint<LideresDoPartido[], PartidoEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<LideresDoPartido>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de deputados que estão ou estiveram em exercício pelo partido.
     * Opcionalmente, pode-se usar os parâmetros `dataInicio`, `dataFim` ou `idLegislatura`
     * para se obter uma lista de deputados filiados ao partido num certo intervalo de tempo.
     */
    async obterMembros(idDoPartido: number, opcoes?: EndpointOpcoes<OrdenarIDNomeSUF>): Promise<MembrosDoPartido[]> {
        idDoPartido = verificarID(idDoPartido);

        const urlBase: PartidoEndpointURL = `${this.endpoint}/${idDoPartido.toString(10)}/membros?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);
        const membrosDoPartido = await fetch(url);
        if (membrosDoPartido.status === 400 || membrosDoPartido.status === 404) return [];

        const json = await membrosDoPartido.json() as CamaraEndpoint<MembrosDoPartido[], PartidoEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<MembrosDoPartido>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<string>>(urlBase: PartidoEndpointURL, opcoes?: T): PartidoEndpointURL {
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
                if (typeof valor !== 'number' || !Number.isInteger(valor)) {
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
    async #obterDadosProximaPagina<T extends DadosDosPartidos>(links: NavegacaoEntrePaginas<CamaraEndpoints>[]) {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);
                const proximoJson = await proximaPagina.json() as CamaraEndpoint<T[], CamaraEndpoints>;
                dados.push(...proximoJson.dados);

                if (Array.isArray(proximoJson.links)) {
                    const dadosExtras = await this.#obterDadosProximaPagina<T>(proximoJson.links);
                    if (dadosExtras.length > 0) dados = [...dados, ...dadosExtras];
                };

                break;
            };
        };

        return dados;
    };
};