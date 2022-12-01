import { obter, verificarData, verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

import type {
    DeputadosURL,
    DeputadoOpcoes,
    DadosBasicosDeputado,
    Deputado,
    DeputadoDespesasOpcoes,
    DespesasDoDeputado,
    DeputadoDiscursosOpcoes,
    DiscursosDoDeputado,
    DeputadoEventosOpcoes,
    EventosDoDeputado,
    FrentesDoDeputado,
    OcupacoesDoDeputado,
    DeputadoOrgaosOpcoes,
    OrgaosDoDeputado,
    ProfissoesDoDeputado,
    EndpointOpcoes,
    DeputadosOrdenarPor,
    DeputadosTodasOpcoes,
    DadosDosDeputados,
    LinksNavegacao
} from "../../index.js";

export class Deputados {
    /** URL para o endpoint dos deputados. */
    readonly endpoint: DeputadosURL = 'https://dadosabertos.camara.leg.br/api/v2/deputados';
    /**
     * Retorna uma lista de dados básicos sobre deputados que estiveram
     * em exercício parlamentar em algum intervalo de tempo.
     * 
     * Se não for passado um parâmetro de tempo, como `idLegislatura` ou `dataInicio`,
     * a lista enumerará somente os deputados em exercício no momento da requisição.
     */
    async obterTodos(opcoes?: DeputadoOpcoes): Promise<DadosBasicosDeputado[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const deputados = await obter<DadosBasicosDeputado[], DeputadosURL>(url);
        if (Array.isArray(deputados.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosDeputado>(deputados.links);
            if (dadosExtras.length > 0) deputados.dados.push(...dadosExtras);
            return deputados.dados;
        };

        return [];
    };

    /** 
     * Retorna os dados cadastrais de um parlamentar identificado pelo ID fornecido que,
     * em algum momento da história e por qualquer período, entrou em exercício na Câmara.
     */
    async obterUm(idDoDeputado: number): Promise<Deputado> {
        idDoDeputado = verificarID(idDoDeputado);

        const url: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}`;
        const deputado = await obter<Deputado, DeputadosURL>(url);
        return deputado.dados;
    };

    /**
     * Dá acesso aos registros de pagamentos e reembolsos feitos pela Câmara em prol do deputado,
     * a título da Cota para Exercício da Atividade Parlamentar, a chamada "cota parlamentar".
     * 
     * A lista pode ser filtrada por mês, ano, legislatura, CNPJ ou CPF de um fornecedor.
     * Se não forem passados os parâmetros de tempo, o método retorna os dados dos seis meses anteriores à requisição.
     */
    async obterDespesas(idDoDeputado: number, opcoes?: DeputadoDespesasOpcoes): Promise<DespesasDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const urlBase: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/despesas?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const despesas = await obter<DespesasDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(despesas.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DespesasDoDeputado>(despesas.links);
            if (dadosExtras.length > 0) despesas.dados.push(...dadosExtras);
            return despesas.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de informações sobre os pronunciamentos feitos pelo deputado
     * que tenham sido registrados, em quaisquer eventos, nos sistemas da Câmara.
     * 
     * Caso os parâmetros de tempo (`dataInicio`, `dataFim` e `idLegislatura`) não sejam configurados na requisição,
     * são buscados os discursos ocorridos nos sete dias anteriores ao da requisição.
     */
    async obterDiscursos(idDoDeputado: number, opcoes?: DeputadoDiscursosOpcoes): Promise<DiscursosDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const urlBase: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/discursos?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const discursos = await obter<DiscursosDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(discursos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DiscursosDoDeputado>(discursos.links);
            if (dadosExtras.length > 0) discursos.dados.push(...dadosExtras);
            return discursos.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de eventos nos quais a participação do parlamentar era ou é prevista.
     * 
     * Um período de tempo pode ser delimitado para a busca.
     * Se não forem passados parâmetros de tempo, são retornados os eventos num período de cinco dias,
     * sendo dois antes e dois depois do dia da requisição.
     * 
     * Os itens podem ser ordenados por `id`, `siglaOrgao` ou `dataHoraInicio`.
     */
    async obterEventos(idDoDeputado: number, opcoes?: DeputadoEventosOpcoes): Promise<EventosDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const urlBase: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/eventos?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const eventos = await obter<EventosDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<EventosDoDeputado>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de informações básicas sobre as frentes parlamentares das quais
     * o parlamentar seja membro, ou, no caso de frentes existentes em legislaturas anteriores,
     * tenha encerrado a legislatura como integrante.
     */
    async obterFrentes(idDoDeputado: number): Promise<FrentesDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const url: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/frentes`;
        const eventos = await obter<FrentesDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<FrentesDoDeputado>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /**
     * Enumera as atividades profissionais ou ocupacionais que o deputado
     * já teve em sua carreira e declarou à Câmara dos Deputados.
     */
    async obterOcupacoes(idDoDeputado: number): Promise<OcupacoesDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const url: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/ocupacoes`;
        const eventos = await obter<OcupacoesDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<OcupacoesDoDeputado>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de órgãos, como as comissões e procuradorias,
     * dos quais o deputado participa ou participou durante um intervalo de tempo.
     * 
     * Cada item identifica um órgão, o cargo ocupado pelo parlamentar
     * neste órgão (como presidente, vice-presidente, titular ou suplente)
     * e as datas de início e fim da ocupação deste cargo.
     * 
     * Se não for passado algum parâmetro de tempo, são retornados os
     * órgãos ocupados pelo parlamentar no momento da requisição.
     * Neste caso a lista será vazia se o deputado não estiver em exercício.
     */
    async obterOrgaos(idDoDeputado: number, opcoes?: DeputadoOrgaosOpcoes): Promise<OrgaosDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const urlBase: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/orgaos?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const eventos = await obter<OrgaosDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<OrgaosDoDeputado>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de dados sobre profissões que o parlamentar declarou à Câmara
     * que já exerceu ou que pode exercer pela sua formação e/ou experiência.
     */
    async obterProfissoes(idDoDeputado: number): Promise<ProfissoesDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const url: DeputadosURL = `${this.endpoint}/${idDoDeputado.toString(10)}/profissoes`;
        const eventos = await obter<ProfissoesDoDeputado[], DeputadosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<ProfissoesDoDeputado>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<DeputadosOrdenarPor>>(url: DeputadosURL, opcoes?: T): DeputadosURL {
        if (!opcoes) return url;

        type OpcoesPossiveis = ReadonlyArray<DeputadosTodasOpcoes>;
        /** Chaves cujo valor devem ser arrays de números. */
        const numberArrayKeys: OpcoesPossiveis = ['ano', 'mes','id', 'idLegislatura'];
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: OpcoesPossiveis = ['cnpjCpfFornecedor', 'nome', 'ordem', 'ordenarPor', 'siglaSexo'];
        
        for (const [key, value] of Object.entries(opcoes) as [DeputadosTodasOpcoes, unknown][]) {
            if (numberArrayKeys.includes(key)) {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if (key === 'siglaPartido' || key === 'siglaUf') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const sigla of value) {
                    if (typeof sigla === 'string') url += `&${key}=${sigla}`;
                };

            } else if ((key === 'dataInicio' || key === 'dataFim') && verificarData(value)) {
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
    async #obterDadosProximaPagina<T extends DadosDosDeputados>(links: LinksNavegacao<DeputadosURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], DeputadosURL>(link.href);
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