import { obter, verificarData, verificarInteiro } from "../common/helpers.js";
import { APIError } from "../error.js";

import type {
    DadosBasicosVotacao,
    DadosDasVotacoes,
    EndpointOpcoes,
    LinksNavegacao,
    OrientacoesDaVotacao,
    Votacao,
    VotacaoOpcoes,
    VotacoesOrdenarPor,
    VotacoesTodasOpcoes,
    VotacoesURL,
    Votos
} from "../../index.js";


export class Votacoes {
    /** URL para o endpoint das votações. */
    static readonly #endpoint: VotacoesURL = 'https://dadosabertos.camara.leg.br/api/v2/votacoes';

    /**
     * Retorna uma lista de informações básicas sobre as votações ocorridas em eventos dos diversos órgãos da Câmara.
     * 
     * Se não forem passadas opções que delimitem o intervalo de tempo da pesquisa,
     * são retornados dados sobre todas as votações ocorridas nos últimos 30 dias, em eventos de todos os órgãos.
     * 
     * As opções de data permitem estender o período, mas por enquanto é necessário que as duas datas sejam de um mesmo ano.
     * Quando apenas uma delas está presente, são retornadas somente as votações ocorridas no mesmo ano, antes de `dataFim` ou após `dataInicio`.
     * 
     * Também é possível filtrar a listagem por ID de órgãos da Câmara, de proposições e de eventos.
     * 
     * Quando não há identificação da proposição que foi efetivamente votada,
     * é preciso usar o método `Votacoes.prototype.obterUma()` para obter
     * uma lista de proposições das quais uma pode ter sido o objeto da votação.
     * 
     * Para mais informações, veja a página de tutorial do Portal de Dados Aberto:
     * https://dadosabertos.camara.leg.br/howtouse/2020-02-07-dados-votacoes.html
     */
    public static async obterTodas(opcoes?: VotacaoOpcoes): Promise<DadosBasicosVotacao[]> {
        const url = this.#construirURL(`${this.#endpoint}?itens=100`, opcoes);
        const votacoes = await obter<DadosBasicosVotacao[], VotacoesURL>(url);
        if (Array.isArray(votacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosVotacao>(votacoes.links);
            if (dadosExtras.length > 0) votacoes.dados.push(...dadosExtras);
            return votacoes.dados;
        };

        return [];
    };

    /**
     * Retorna um conjunto detalhado de dados sobre a votação, tais como as proposições que
     * podem ter sido o objeto da votação e os efeitos de tramitação de outras proposições
     * que eventualmente tenham sido cadastrados em consequência desta votação.
     * 
     * Para compreender melhor os dados retornados, veja o tutorial sobre votações do Portal de Dados Abertos:
     * https://dadosabertos.camara.leg.br/howtouse/2020-02-07-dados-votacoes.html
     */
    public static async obterUma(idDaVotacao: string): Promise<Votacao> {
        if (typeof idDaVotacao !== 'string') {
            throw new APIError(`${idDaVotacao} deveria ser uma string, mas é um(a) ${typeof idDaVotacao}`);
        };

        const url: VotacoesURL = `${this.#endpoint}/${idDaVotacao}`;
        const votacao = await obter<Votacao, VotacoesURL>(url);
        return votacao.dados;
    };

    /**
     * Em muitas votações, os líderes de partidos e blocos – as bancadas – fazem recomendações de voto para seus parlamentares.
     * Essas orientações de uma votação também são feitas pelas lideranças de Governo, Minoria e as mais recentes Maioria e Oposição.
     * 
     * Uma liderança também pode liberar a bancada para que cada deputado vote como quiser, ou entrar em obstrução,
     * para que seus parlamentares não sejam contados para o quórum da votação.
     * 
     * Se a votação teve orientações, este método retorna uma lista em que cada item contém os identificadores
     * de um partido, bloco ou liderança, e o posicionamento ou voto que foi recomendado aos seus parlamentares.
     * 
     * Até o momento, só estão disponíveis dados sobre orientações dadas em votações no Plenário.
     */
    public static async obterOrientacoes(idDaVotacao: string): Promise<OrientacoesDaVotacao[]> {
        if (typeof idDaVotacao !== 'string') {
            throw new APIError(`${idDaVotacao} deveria ser uma string, mas é um(a) ${typeof idDaVotacao}`);
        };

        const url: VotacoesURL = `${this.#endpoint}/${idDaVotacao}/orientacoes`;
        const orientacoes = await obter<OrientacoesDaVotacao[], VotacoesURL>(url);
        if (Array.isArray(orientacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<OrientacoesDaVotacao>(orientacoes.links);
            if (dadosExtras.length > 0) orientacoes.dados.push(...dadosExtras);
            return orientacoes.dados;
        };

        return [];
    };

    /**
     * Se o ID é de uma votação da Câmara nominal que não tenha sido secreta,
     * este método retorna uma lista em que cada item contém o ID
     * de um deputado e o voto ou posicionamento que ele registrou.
     * 
     * O resultado é uma lista vazia caso tenha sido uma votação simbólica,
     * em que os votos individuais não são contabilizados.
     * 
     * Mas há algumas votações simbólicas que também têm registros de "votos":
     * nesses casos, normalmente se trata de parlamentares que
     * pediram expressamente que seus posicionamentos fossem registrados.
     * 
     * Não são listados parlamentares ausentes à votação.
     */
    public static async obterVotos(idDaVotacao: string): Promise<Votos[]> {
        if (typeof idDaVotacao !== 'string') {
            throw new APIError(`${idDaVotacao} deveria ser uma string, mas é um(a) ${typeof idDaVotacao}`);
        };

        const url: VotacoesURL = `${this.#endpoint}/${idDaVotacao}/votos`;
        const votos = await obter<Votos[], VotacoesURL>(url);
        if (Array.isArray(votos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<Votos>(votos.links);
            if (dadosExtras.length > 0) votos.dados.push(...dadosExtras);
            return votos.dados;
        };

        return [];
    };

    /** Constrói a URL com base nas opções fornecidas. */
    static #construirURL<T extends EndpointOpcoes<VotacoesOrdenarPor>>(url: VotacoesURL, opcoes?: T): VotacoesURL {
        if (!opcoes) return url;

        type OpcoesPossiveis = ReadonlyArray<VotacoesTodasOpcoes>;
        /** Chaves cujo valor devem ser arrays de números. */
        const numberArrayKeys: OpcoesPossiveis = ['idProposicao', 'idEvento', 'idOrgao'];
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: OpcoesPossiveis = ['ordem', 'ordenarPor'];
        
        for (const [key, value] of Object.entries(opcoes) as [VotacoesTodasOpcoes, unknown][]) {
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

            } else if (key === 'id') {
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
    static async #obterDadosProximaPagina<T extends DadosDasVotacoes>(links: LinksNavegacao<VotacoesURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], VotacoesURL>(link.href);
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