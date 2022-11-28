import { APIError } from "../error.js";
import { verificarData, verificarID } from "../common/helpers.js";

export default class Partidos {
    /** URL para o endpoint dos partidos. */
    readonly endpoint: PartidosEndpointURL = 'https://dadosabertos.camara.leg.br/api/v2/partidos';

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

        const status = APIError.handleStatus(dadosDosPartidos.status);
        if (status === false) return [];

        const json = await dadosDosPartidos.json() as ResultadoBusca<DadosBasicosPartido[], PartidosEndpointURL>;
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

        const status = APIError.handleStatus(dadosDoPartido.status);
        if (status === false) return null;

        const json = await dadosDoPartido.json() as ResultadoBusca<Partido, PartidosEndpointURL>;
        return json.dados;
    };

    /** Retorna uma lista de deputados que ocupam cargos de líder ou vice-líder do partido. */
    async obterLideres(idDoPartido: number): Promise<LideresDoPartido[]> {
        idDoPartido = verificarID(idDoPartido);

        const url = `${this.endpoint}/${idDoPartido.toString(10)}/lideres?itens=100`;
        const lideresDoPartido = await fetch(url);

        const status = APIError.handleStatus(lideresDoPartido.status);
        if (status === false) return [];

        const json = await lideresDoPartido.json() as ResultadoBusca<LideresDoPartido[], PartidosEndpointURL>;
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
    async obterMembros(idDoPartido: number, opcoes?: EndpointOpcoes<OrdenarPartidosMembros>): Promise<MembrosDoPartido[]> {
        idDoPartido = verificarID(idDoPartido);

        const urlBase: PartidosEndpointURL = `${this.endpoint}/${idDoPartido.toString(10)}/membros?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);
        const membrosDoPartido = await fetch(url);

        const status = APIError.handleStatus(membrosDoPartido.status);
        if (status === false) return [];

        const json = await membrosDoPartido.json() as ResultadoBusca<MembrosDoPartido[], PartidosEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<MembrosDoPartido>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<PartidosOrdenarPor>>(url: PartidosEndpointURL, opcoes?: T): PartidosEndpointURL {
        if (!opcoes) return url;

        type Opcoes = keyof PartidoEndpointOpcoes;
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: StringKeys<Opcoes> = ['ordem', 'ordenarPor'];

        for (const [key, value] of Object.entries(opcoes) as [Opcoes, unknown][]) {
            if (key === 'sigla') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const sigla of value) {
                    if (typeof sigla === 'string') url += `&${key}=${sigla}`;
                };

            } else if ((key === 'dataInicio' || key === 'dataFim') && verificarData(value)) {
                url += `&${key}=${value}`;

            } else if (key === 'idLegislatura') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if (stringKeys.includes(key)) {
                if (typeof value !== 'string') throw new APIError(`${key} deveria ser uma string, mas é um(a) ${typeof value}`);
                url += `&${key}=${value}`;

            } else {
                throw new APIError(`${key} não é uma opção válida.`);
            };
        };

        return url;
    };

    /** Obtém os dados da próxima página. */ 
    async #obterDadosProximaPagina<T extends DadosDosPartidos>(links: LinksNavegacao<PartidosEndpointURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);

                const status = APIError.handleStatus(proximaPagina.status);
                if (status === false) return [];

                const proximoJson = await proximaPagina.json() as ResultadoBusca<T[], PartidosEndpointURL>;
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