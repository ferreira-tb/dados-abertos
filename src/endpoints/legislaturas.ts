import { verificarData, verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

export default class Legislaturas {
    /** URL para o endpoint das legislaturas. */
    readonly endpoint: LegislaturasEndpointURL = 'https://dadosabertos.camara.leg.br/api/v2/legislaturas';

    /**
     * Legislatura é o nome dado ao período de trabalhos parlamentares entre uma eleição e outra.
     * Este método retorna uma lista em que cada item contém as informações básicas sobre um desses períodos.
     * 
     * Os números que identificam as legislaturas são sequenciais, desde a primeira que ocorreu.
     */
    async obterTodas(opcoes?: LegislaturaEndpointOpcoes): Promise<DadosBasicosLegislatura[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const dadosDasLegislaturas = await fetch(url);
        APIError.handleStatus(dadosDasLegislaturas.status);

        const json = await dadosDasLegislaturas.json() as ResultadoBusca<DadosBasicosLegislatura[], LegislaturasEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosLegislatura>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** Retorna informações sobre uma determinada legislatura da Câmara. */
    async obterUma(idDaLegislatura: number): Promise<Legislatura> {
        idDaLegislatura = verificarID(idDaLegislatura);

        const url = `${this.endpoint}/${idDaLegislatura.toString(10)}`;
        const dadosDaLegislatura = await fetch(url);
        APIError.handleStatus(dadosDaLegislatura.status);

        const json = await dadosDaLegislatura.json() as ResultadoBusca<Legislatura, LegislaturasEndpointURL>;
        return json.dados;
    };

    /** 
     * Retorna uma lista de parlamentares que ocuparam cargos de liderança ao longo da legislatura.
     * Cada item identifica um parlamentar, uma bancada (partido, bloco ou lideranças de situação e oposição),
     * o título de liderança exercido e o período de exercício do parlamentar nesta posição.
     */
    async obterLideres(idDaLegislatura: number): Promise<LideresDaLegislatura[]> {
        idDaLegislatura = verificarID(idDaLegislatura);

        const url = `${this.endpoint}/${idDaLegislatura.toString(10)}/lideres?itens=100`;
        const lideresDaLegislatura = await fetch(url);
        APIError.handleStatus(lideresDaLegislatura.status);

        const json = await lideresDaLegislatura.json() as ResultadoBusca<LideresDaLegislatura[], LegislaturasEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<LideresDaLegislatura>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista com dados básicos sobre todos os deputados que ocuparam algum
     * posto na Mesa Diretora da Câmara em algum período de tempo durante a legislatura.
     * 
     * Normalmente, cada legislatura tem duas Mesas Diretoras, com presidente, dois vice-presidentes,
     * quatro secretários parlamentares e os suplentes dos secretários.
     */
    async obterMesa(idDaLegislatura: number, opcoes?: LegislaturaMesaEndpointOpcoes): Promise<MesaDaLegislatura> {
        idDaLegislatura = verificarID(idDaLegislatura);

        const urlBase: LegislaturasEndpointURL = `${this.endpoint}/${idDaLegislatura.toString(10)}/mesa`;
        const url = this.#construirURL(urlBase, opcoes);
        const mesaDiretora = await fetch(url);
        APIError.handleStatus(mesaDiretora.status);

        const json = await mesaDiretora.json() as ResultadoBusca<MesaDaLegislatura, LegislaturasEndpointURL>;
        return json.dados;
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<LegislaturasOrdenarPor>>(url: LegislaturasEndpointURL, opcoes?: T): LegislaturasEndpointURL {
        if (!opcoes) return url;

        /** Chaves cujo valor devem ser strings. */
        const stringKeys: ReadonlyArray<LegislaturasTodasOpcoes> = ['ordem', 'ordenarPor'];
        
        for (const [key, value] of Object.entries(opcoes) as [LegislaturasTodasOpcoes, unknown][]) {
            if (key === 'id') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if ((key === 'data' || key === 'dataInicio' || key === 'dataFim') && verificarData(value)) {
                url += `&${key}=${value}`;

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
    async #obterDadosProximaPagina<T extends DadosDasLegislaturas>(links: LinksNavegacao<LegislaturasEndpointURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (typeof link.href !== 'string') throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);
                APIError.handleStatus(proximaPagina.status);

                const proximoJson = await proximaPagina.json() as ResultadoBusca<T[], LegislaturasEndpointURL>;
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