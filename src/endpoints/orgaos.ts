import { APIError } from "../error.js";
import { obter, verificarData, verificarInteiro } from "../common/helpers.js";

import type {
    DadosBasicosEvento,
    DadosBasicosOrgao,
    DadosBasicosVotacao,
    DadosDosOrgaos,
    EndpointOpcoes,
    LinksNavegacao,
    MembroDoOrgao,
    Orgao,
    OrgaoEventoOpcoes,
    OrgaoMembroOpcoes,
    OrgaoOpcoes,
    OrgaosOrdenarPor,
    OrgaosTodasOpcoes,
    OrgaosURL,
    OrgaoVotacaoOpcoes
} from "../main.js";

export class Orgaos {
    /** URL para o endpoint das votações. */
    static readonly #endpoint: OrgaosURL = 'https://dadosabertos.camara.leg.br/api/v2/orgaos';

    /** Retorna uma lista de informações básicas sobre os órgãos legislativos. */
    public static async obterTodos(opcoes?: OrgaoOpcoes): Promise<DadosBasicosOrgao[]> {
        const url = this.#construirURL(`${this.#endpoint}?itens=100`, opcoes);
        const votacoes = await obter<DadosBasicosOrgao[], OrgaosURL>(url);
        if (Array.isArray(votacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosOrgao>(votacoes.links);
            if (dadosExtras.length > 0) votacoes.dados.push(...dadosExtras);
            return votacoes.dados;
        };

        return [];
    };

    /** Retorna todas as informações disponíveis sobre o órgão. */
    public static async obterUm(idDoOrgao: number): Promise<Orgao> {
        idDoOrgao = verificarInteiro(idDoOrgao);

        const url: OrgaosURL = `${this.#endpoint}/${idDoOrgao.toString(10)}`;
        const orgao = await obter<Orgao, OrgaosURL>(url);
        return orgao.dados;
    };

    /**
     * Retorna uma lista de informações resumidas dos eventos realizados (ou a realizar) pelo órgão legislativo.
     * 
     * Por padrão, são retornados eventos em andamento ou previstos para o mesmo dia, dois dias antes e dois dias depois da requisição. 
     * Opções podem ser passadas para alterar esse período, bem como os tipos de eventos.
     */
    public static async obterEventos(idDoOrgao: number, opcoes?: OrgaoEventoOpcoes): Promise<DadosBasicosEvento[]> {
        idDoOrgao = verificarInteiro(idDoOrgao);

        const urlBase: OrgaosURL = `${this.#endpoint}/${idDoOrgao.toString(10)}/eventos?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const eventos = await obter<DadosBasicosEvento[], OrgaosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosEvento>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de dados resumidos que identificam cada parlamentar e o cargo ou posição
     * que ocupa ou ocupou no órgão parlamentar durante um certo período de tempo.
     * 
     * Se não forem passadas opções que delimitem esse período, o método retorna os membros do órgão
     * no momento da requisição. Se o órgão não existir mais ou não estiver instalado, é retornada uma lista vazia.
     */
    public static async obterMembros(idDoOrgao: number, opcoes?: OrgaoMembroOpcoes): Promise<MembroDoOrgao[]> {
        idDoOrgao = verificarInteiro(idDoOrgao);

        const urlBase: OrgaosURL = `${this.#endpoint}/${idDoOrgao.toString(10)}/membros?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const membros = await obter<MembroDoOrgao[], OrgaosURL>(url);
        if (Array.isArray(membros.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<MembroDoOrgao>(membros.links);
            if (dadosExtras.length > 0) membros.dados.push(...dadosExtras);
            return membros.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de dados básicos de votações que tenham sido realizadas em eventos realizados no órgão.
     * 
     * Se for um órgão permanente da Câmara, são retornados, por padrão, dados sobre as votações
     * realizadas pelo órgão nos últimos 30 dias. Esse período pode ser alterado com o uso das opções
     * `dataInicio` e/ou `dataFim`, que por enquanto são limitados a selecionar somente votações ocorridas em um mesmo ano.
     * 
     * Caso seja um órgão temporário, como uma comissão especial, são listadas por padrão
     * todas as votações ocorridas no órgão, em qualquer período de tempo.
     * 
     * Dados complementares sobre cada votação listada podem ser obtidos através do método `Votacoes.obterUma()`.
     * 
     * Para compreender melhor os dados sobre votações, veja a página de tutorial do Portal de Dados Abertos:
     * https://dadosabertos.camara.leg.br/howtouse/2020-02-07-dados-votacoes.html
     */
    public static async obterVotacoes(idDoOrgao: number, opcoes?: OrgaoVotacaoOpcoes): Promise<DadosBasicosVotacao[]> {
        idDoOrgao = verificarInteiro(idDoOrgao);

        const urlBase: OrgaosURL = `${this.#endpoint}/${idDoOrgao.toString(10)}/votacoes?itens=200`;
        const url = this.#construirURL(urlBase, opcoes);

        const votacoes = await obter<DadosBasicosVotacao[], OrgaosURL>(url);
        if (Array.isArray(votacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosVotacao>(votacoes.links);
            if (dadosExtras.length > 0) votacoes.dados.push(...dadosExtras);
            return votacoes.dados;
        };

        return [];
    };

    /** Constrói a URL com base nas opções fornecidas. */
    static #construirURL<T extends EndpointOpcoes<OrgaosOrdenarPor>>(url: OrgaosURL, opcoes?: T): OrgaosURL {
        if (!opcoes) return url;

        type OpcoesPossiveis = ReadonlyArray<OrgaosTodasOpcoes>;
        /** Chaves cujo valor devem ser arrays de números. */
        const numberArrayKeys: OpcoesPossiveis = ['id', 'codTipoOrgao', 'idTipoEvento', 'idProposicao'];
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: OpcoesPossiveis = ['ordem', 'ordenarPor'];
        
        for (const [key, value] of Object.entries(opcoes) as [OrgaosTodasOpcoes, unknown][]) {
            if (numberArrayKeys.includes(key)) {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarInteiro(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if (key === 'dataInicio' || key === 'dataFim') {
                const data = verificarData(value);
                url += `&${key}=${data}`;

            } else if (stringKeys.includes(key)) {
                if (typeof value !== 'string') throw new APIError(`${key} deveria ser uma string, mas é um(a) ${typeof value}`);
                url += `&${key}=${value}`;

            } else if (key === 'sigla') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const sigla of value) {
                    if (typeof sigla === 'string') url += `&${key}=${sigla}`;
                };

            } else {
                throw new APIError(`${key} não é uma opção válida.`);
            };
        };

        return url;
    };

    /** Obtém os dados da próxima página. */
    static async #obterDadosProximaPagina<T extends DadosDosOrgaos>(links: LinksNavegacao<OrgaosURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], OrgaosURL>(link.href);
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