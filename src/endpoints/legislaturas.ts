import { obter, verificarData, verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

export default class Legislaturas {
    /** URL para o endpoint das legislaturas. */
    readonly endpoint: LegislaturasURL = 'https://dadosabertos.camara.leg.br/api/v2/legislaturas';

    /**
     * Legislatura é o nome dado ao período de trabalhos parlamentares entre uma eleição e outra.
     * Este método retorna uma lista em que cada item contém as informações básicas sobre um desses períodos.
     * 
     * Os números que identificam as legislaturas são sequenciais, desde a primeira que ocorreu.
     */
    async obterTodas(opcoes?: LegislaturaEndpointOpcoes): Promise<DadosBasicosLegislatura[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const legislaturas = await obter<DadosBasicosLegislatura[], LegislaturasURL>(url);

        if (Array.isArray(legislaturas.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosLegislatura>(legislaturas.links);
            if (dadosExtras.length > 0) legislaturas.dados.push(...dadosExtras);
            return legislaturas.dados;
        };

        return [];
    };

    /** Retorna informações sobre uma determinada legislatura da Câmara. */
    async obterUma(idDaLegislatura: number): Promise<Legislatura> {
        idDaLegislatura = verificarID(idDaLegislatura);

        const url: LegislaturasURL = `${this.endpoint}/${idDaLegislatura.toString(10)}`;
        const legislatura = await obter<Legislatura, LegislaturasURL>(url);
        return legislatura.dados;
    };

    /** 
     * Retorna uma lista de parlamentares que ocuparam cargos de liderança ao longo da legislatura.
     * Cada item identifica um parlamentar, uma bancada (partido, bloco ou lideranças de situação e oposição),
     * o título de liderança exercido e o período de exercício do parlamentar nesta posição.
     */
    async obterLideres(idDaLegislatura: number): Promise<LideresDaLegislatura[]> {
        idDaLegislatura = verificarID(idDaLegislatura);

        const url: LegislaturasURL = `${this.endpoint}/${idDaLegislatura.toString(10)}/lideres?itens=100`;
        const lideres = await obter<LideresDaLegislatura[], LegislaturasURL>(url);
        if (Array.isArray(lideres.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<LideresDaLegislatura>(lideres.links);
            if (dadosExtras.length > 0) lideres.dados.push(...dadosExtras);
            return lideres.dados;
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

        const urlBase: LegislaturasURL = `${this.endpoint}/${idDaLegislatura.toString(10)}/mesa`;
        const url = this.#construirURL(urlBase, opcoes);   
        const mesa = await obter<MesaDaLegislatura, LegislaturasURL>(url);
        return mesa.dados;
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<LegislaturasOrdenarPor>>(url: LegislaturasURL, opcoes?: T): LegislaturasURL {
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
    async #obterDadosProximaPagina<T extends DadosDasLegislaturas>(links: LinksNavegacao<LegislaturasURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (typeof link.href !== 'string') throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);
                APIError.handleStatus(proximaPagina.status);

                const proximoJson = await proximaPagina.json() as ResultadoBusca<T[], LegislaturasURL>;
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