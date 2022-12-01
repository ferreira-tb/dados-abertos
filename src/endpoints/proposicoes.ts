import { obter, verificarData, verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

export class Proposicoes {
    /** URL para o endpoint das proposições. */
    readonly endpoint: ProposicoesURL = 'https://dadosabertos.camara.leg.br/api/v2/proposicoes';

    /**
     * Lista de informações básicas sobre projetos de lei, resoluções, medidas provisórias,
     * emendas, pareceres e todos os outros tipos de proposições na Câmara.
     * 
     * Por padrão, são retornadas todas as proposições que foram apresentadas
     * ou tiveram alguma mudança de situação nos últimos 30 dias.
     * Esse intervalo de tramitação pode ser configurado pelas opções `dataInicio` e `dataFim`.
     * 
     * Considere as seguintes opções: `id`, `ano`, `dataApresentacaoInicio`, `dataApresentacaoFim`,
     * `idAutor` e `autor`. Se algumas dessas opções forem passadas, o intervalo de tramitação só será levado
     * em consideração se os parâmetros `dataInicio` e/ou `dataFim` estiverem explicitamente configurados.
     * 
     * Se não forem, poderão ser listadas proposições que não tiveram tramitação recente (e a resposta pode demorar bastante).
     */
    async obterTodas(opcoes?: ProposicaoOpcoes): Promise<DadosBasicosProposicao[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const proposicoes = await obter<DadosBasicosProposicao[], ProposicoesURL>(url);
        if (Array.isArray(proposicoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosProposicao>(proposicoes.links);
            if (dadosExtras.length > 0) proposicoes.dados.push(...dadosExtras);
            return proposicoes.dados;
        };

        return [];
    };

    /** Informações detalhadas sobre uma proposição específica. */
    async obterUma(idDaProposicao: number): Promise<Proposicao> {
        idDaProposicao = verificarID(idDaProposicao);

        const url: ProposicoesURL = `${this.endpoint}/${idDaProposicao.toString(10)}`;
        const proposicao = await obter<Proposicao, ProposicoesURL>(url);
        return proposicao.dados;
    };

    /**
     * Retorna uma lista em que cada item identifica uma pessoa ou entidade que é autora da proposição.
     * Além de deputados, também podem ser autores de proposições os senadores,
     * a sociedade civil, assembleias legislativas e os poderes Executivo e Judiciário.
     * 
     * Pelo Regimento da Câmara, todos os que assinam uma proposição são considerados
     * autores (art. 102), tanto os proponentes quanto os apoiadores.
     * 
     * Para obter mais informações sobre cada autor, é recomendável acessar, se disponível, a URL que é valor da propriedade `uri`.
     */
    async obterAutores(idDaProposicao: number): Promise<AutorDaProposicao[]> {
        idDaProposicao = verificarID(idDaProposicao);

        const url: ProposicoesURL = `${this.endpoint}/${idDaProposicao.toString(10)}/autores`;
        const autores = await obter<AutorDaProposicao[], ProposicoesURL>(url);
        if (Array.isArray(autores.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<AutorDaProposicao>(autores.links);
            if (dadosExtras.length > 0) autores.dados.push(...dadosExtras);
            return autores.dados;
        };

        return [];
    };

    /**
     * Lista de informações básicas sobre proposições que de alguma forma se relacionam com a proposição,
     * como pareceres, requerimentos, substitutivos, etc.
     */
    async obterRelacionadas(idDaProposicao: number): Promise<ProposicaoRelacionada[]> {
        idDaProposicao = verificarID(idDaProposicao);

        const url: ProposicoesURL = `${this.endpoint}/${idDaProposicao.toString(10)}/relacionadas`;
        const relacionadas = await obter<ProposicaoRelacionada[], ProposicoesURL>(url);
        if (Array.isArray(relacionadas.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<ProposicaoRelacionada>(relacionadas.links);
            if (dadosExtras.length > 0) relacionadas.dados.push(...dadosExtras);
            return relacionadas.dados;
        };

        return [];
    };

    /**
     * Lista em que cada item traz informações sobre uma área temática à qual a proposição se relaciona,
     * segundo classificação oficial do Centro de Documentação e Informação da Câmara.
     */
    async obterTemas(idDaProposicao: number): Promise<TemaDaProposicao[]> {
        idDaProposicao = verificarID(idDaProposicao);

        const url: ProposicoesURL = `${this.endpoint}/${idDaProposicao.toString(10)}/temas`;
        const temas = await obter<TemaDaProposicao[], ProposicoesURL>(url);
        if (Array.isArray(temas.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<TemaDaProposicao>(temas.links);
            if (dadosExtras.length > 0) temas.dados.push(...dadosExtras);
            return temas.dados;
        };

        return [];
    };

    /**
     * Lista que traz, como cada item, um “retrato” de informações que podem ser alteradas
     * a cada etapa de tramitação na vida de uma proposição (como regime de tramitação e situação)
     * e informações sobre o que causou esse novo estado.
     * 
     * Esta representação das tramitações ainda é provisória.
     */
    async obterTramitacoes(idDaProposicao: number, opcoes?: ProposicaoTramitacaoOpcoes): Promise<TramitacaoDaProposicao[]> {
        idDaProposicao = verificarID(idDaProposicao);

        const urlBase: ProposicoesURL = `${this.endpoint}/${idDaProposicao.toString(10)}/tramitacoes`;
        const url = this.#construirURL(urlBase, opcoes);

        const tramitacoes = await obter<TramitacaoDaProposicao[], ProposicoesURL>(url);
        if (Array.isArray(tramitacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<TramitacaoDaProposicao>(tramitacoes.links);
            if (dadosExtras.length > 0) tramitacoes.dados.push(...dadosExtras);
            return tramitacoes.dados;
        };

        return [];
    };

    async obterVotacoes(idDaProposicao: number, opcoes?: ProposicaoVotacaoOpcoes): Promise<VotacaoDaProposicao[]> {
        idDaProposicao = verificarID(idDaProposicao);

        const urlBase: ProposicoesURL = `${this.endpoint}/${idDaProposicao.toString(10)}/votacoes`;
        const url = this.#construirURL(urlBase, opcoes);

        const votacoes = await obter<VotacaoDaProposicao[], ProposicoesURL>(url);
        if (Array.isArray(votacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<VotacaoDaProposicao>(votacoes.links);
            if (dadosExtras.length > 0) votacoes.dados.push(...dadosExtras);
            return votacoes.dados;
        };

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<ProposicoesOrdenarPor>>(url: ProposicoesURL, opcoes?: T): ProposicoesURL {
        if (!opcoes) return url;

        type OpcoesPossiveis = ReadonlyArray<ProposicoesTodasOpcoes>;
        /** Chaves cujo valor devem ser números. */
        const numberKeys: OpcoesPossiveis = ['idPartidoAutor'];
        /** Chaves cujo valor devem ser arrays de números. */
        const numberArrayKeys: OpcoesPossiveis = ['id', 'numero', 'ano', 'idDeputadoAutor', 'codSituacao', 'codTema'];
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: OpcoesPossiveis = ['autor', 'ordem', 'ordenarPor'];
        /** Chaves cujo valor devem ser arrays de strings. */
        const stringArrayKeys: OpcoesPossiveis = ['siglaTipo', 'siglaPartidoAutor', 'siglaUfAutor', 'keywords'];
        /** Chaves cujo valor devem ser datas no formato `AAAA-MM-DD`. */
        const dateKeys: OpcoesPossiveis = ['dataInicio', 'dataFim', 'dataApresentacaoInicio', 'dataApresentacaoFim'];

        for (const [key, value] of Object.entries(opcoes) as [ProposicoesTodasOpcoes, unknown][]) {
            if (stringArrayKeys.includes(key)) {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const sigla of value) {
                    if (typeof sigla === 'string') url += `&${key}=${sigla}`;
                };

            } else if (numberArrayKeys.includes(key)) {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if (dateKeys.includes(key) && verificarData(value)) {
                url += `&${key}=${value}`;

            } else if (stringKeys.includes(key)) {
                if (typeof value !== 'string') throw new APIError(`${key} deveria ser uma string, mas é um(a) ${typeof value}`);
                url += `&${key}=${value}`;

            } else if (numberKeys.includes(key)) {
                const id = verificarID(value);
                url += `&${key}=${id.toString(10)}`;

            } else if (key === 'tramitacaoSenado') {
                if (typeof value !== 'boolean') throw new APIError(`${key} deveria ser um boolean, mas é um(a) ${typeof value}`);
                url += `&${key}=${value.toString()}`;

            } else {
                throw new APIError(`${key} não é uma opção válida.`);
            };
        };

        return url;
    };

    /** Obtém os dados da próxima página. */ 
    async #obterDadosProximaPagina<T extends DadosDasProposicoes>(links: LinksNavegacao<ProposicoesURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], ProposicoesURL>(link.href);
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