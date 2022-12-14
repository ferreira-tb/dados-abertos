import { APIError } from "../error.js";
import { obter, verificarData, verificarInteiro } from "../common/helpers.js";

import type {
    PartidosURL,
    PartidoOpcoes,
    DadosBasicosPartido,
    Partido,
    LideresDoPartido,
    PartidoMembrosOpcoes,
    MembroDoPartido,
    EndpointOpcoes,
    PartidosOrdenarPor,
    PartidosTodasOpcoes,
    DadosDosPartidos,
    LinksNavegacao
} from "../main.js";

export class Partidos {
    /** URL para o endpoint dos partidos. */
    static readonly #endpoint: PartidosURL = 'https://dadosabertos.camara.leg.br/api/v2/partidos';

    /** 
     * Retorna uma lista de dados básicos sobre os partidos políticos que têm ou já tiveram deputados na Câmara.
     * 
     * Se não forem passadas opções, retorna os partidos que têm deputados em exercício no momento da requisição.
     * 
     * É possível obter uma lista de partidos representados na Câmara em um certo intervalo de datas ou de legislaturas.
     * Se um intervalo de uma ou mais legislaturas não coincidentes forem passados, todos os intervalos de tempo serão somados.
     * 
     * Também se pode fazer busca por uma ou mais siglas, mas, em diferentes legislaturas, pode haver mais de um partido usando a mesma sigla.
     */
    public static async obterTodos(opcoes?: PartidoOpcoes): Promise<DadosBasicosPartido[]> {
        const url = this.#construirURL(`${this.#endpoint}?itens=100`, opcoes);
        const partidos = await obter<DadosBasicosPartido[], PartidosURL>(url);
        if (Array.isArray(partidos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosPartido>(partidos.links);
            if (dadosExtras.length > 0) partidos.dados.push(...dadosExtras);
            return partidos.dados;
        };

        return [];
    };

    /** Retorna informações detalhadas sobre um partido. */
    public static async obterUm(idDoPartido: number): Promise<Partido> {
        idDoPartido = verificarInteiro(idDoPartido);

        const url: PartidosURL = `${this.#endpoint}/${idDoPartido.toString(10)}`;
        const partido = await obter<Partido, PartidosURL>(url);
        return partido.dados;
    };

    /** 
     * Retorna uma lista de deputados que ocupam cargos de líder ou vice-líder do partido,
     * com a identificação do cargo e o período em que o tiveram.
     */
    public static async obterLideres(idDoPartido: number): Promise<LideresDoPartido[]> {
        idDoPartido = verificarInteiro(idDoPartido);

        const url: PartidosURL = `${this.#endpoint}/${idDoPartido.toString(10)}/lideres?itens=100`;
        const lideres = await obter<LideresDoPartido[], PartidosURL>(url);
        if (Array.isArray(lideres.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<LideresDoPartido>(lideres.links);
            if (dadosExtras.length > 0) lideres.dados.push(...dadosExtras);
            return lideres.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de deputados que estão ou estiveram em exercício pelo partido.
     * Opcionalmente, pode-se usar as opções `dataInicio`, `dataFim` ou `idLegislatura`
     * para se obter uma lista de deputados filiados ao partido num certo intervalo de tempo.
     * 
     * PENDENTE: https://github.com/CamaraDosDeputados/dados-abertos/issues/324
     */
    public static async obterMembros(idDoPartido: number, opcoes?: PartidoMembrosOpcoes): Promise<MembroDoPartido[]> {
        idDoPartido = verificarInteiro(idDoPartido);

        const urlBase: PartidosURL = `${this.#endpoint}/${idDoPartido.toString(10)}/membros?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const membros = await obter<MembroDoPartido[], PartidosURL>(url);
        if (Array.isArray(membros.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<MembroDoPartido>(membros.links);
            if (dadosExtras.length > 0) membros.dados.push(...dadosExtras);
            return membros.dados;
        };

        return [];
    };

    /** Constrói a URL com base nas opções fornecidas. */
    static #construirURL<T extends EndpointOpcoes<PartidosOrdenarPor>>(url: PartidosURL, opcoes?: T): PartidosURL {
        if (!opcoes) return url;

        /** Chaves cujo valor devem ser strings. */
        const stringKeys: ReadonlyArray<PartidosTodasOpcoes> = ['ordem', 'ordenarPor'];

        for (const [key, value] of Object.entries(opcoes) as [PartidosTodasOpcoes, unknown][]) {
            if (key === 'sigla') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const sigla of value) {
                    if (typeof sigla === 'string') url += `&${key}=${sigla}`;
                };

            } else if (key === 'dataInicio' || key === 'dataFim') {
                const data = verificarData(value);
                url += `&${key}=${data}`;

            } else if (key === 'idLegislatura') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarInteiro(numero);
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
    static async #obterDadosProximaPagina<T extends DadosDosPartidos>(links: LinksNavegacao<PartidosURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], PartidosURL>(link.href);
                dados.push(...proximaPagina.dados);

                if (Array.isArray(proximaPagina.links)) {
                    const dadosExtras = await this.#obterDadosProximaPagina<T>(proximaPagina.links);
                    if (dadosExtras.length > 0) dados = [...dados, ...dadosExtras];
                };

                break;
            };
        };

        return dados;
    };
};