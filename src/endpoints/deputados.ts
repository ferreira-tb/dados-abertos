import { verificarData, verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

export default class Deputados {
    /** URL para o endpoint dos deputados. */
    readonly endpoint: DeputadosEndpointURL = 'https://dadosabertos.camara.leg.br/api/v2/deputados';
    /**
     * Retorna uma lista de dados básicos sobre deputados que estiveram
     * em exercício parlamentar em algum intervalo de tempo.
     * 
     * Se não for passado um parâmetro de tempo, como `idLegislatura` ou `dataInicio`,
     * a lista enumerará somente os deputados em exercício no momento da requisição.
     */
    async obterTodos(opcoes?: DeputadoEndpointOpcoes): Promise<DadosBasicosDeputado[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const dadosDosDeputados = await fetch(url);
        APIError.handleStatus(dadosDosDeputados.status);

        const json = await dadosDosDeputados.json() as ResultadoBusca<DadosBasicosDeputado[], DeputadosEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosDeputado>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** 
     * Retorna os dados cadastrais de um parlamentar identificado pelo ID fornecido que,
     * em algum momento da história e por qualquer período, entrou em exercício na Câmara.
     */
    async obterUm(idDoDeputado: number): Promise<Deputado> {
        idDoDeputado = verificarID(idDoDeputado);

        const url = `${this.endpoint}/${idDoDeputado.toString(10)}`;
        const dadosDoDeputado = await fetch(url);
        APIError.handleStatus(dadosDoDeputado.status);

        const json = await dadosDoDeputado.json() as ResultadoBusca<Deputado, DeputadosEndpointURL>;
        return json.dados;
    };

    /**
     * Dá acesso aos registros de pagamentos e reembolsos feitos pela Câmara em prol do deputado,
     * a título da Cota para Exercício da Atividade Parlamentar, a chamada "cota parlamentar".
     * 
     * A lista pode ser filtrada por mês, ano, legislatura, CNPJ ou CPF de um fornecedor.
     * Se não forem passados os parâmetros de tempo, o método retorna os dados dos seis meses anteriores à requisição.
     */
    async obterDespesas(idDoDeputado: number, opcoes?: DeputadoDespesasEndpointOpcoes): Promise<DespesasDoDeputado[]> {
        idDoDeputado = verificarID(idDoDeputado);

        const urlBase: DeputadosEndpointURL = `${this.endpoint}/${idDoDeputado.toString(10)}/despesas?itens=100`;
        const url = this.#construirURL(urlBase, opcoes);

        const dadosDasDespesas = await fetch(url);
        APIError.handleStatus(dadosDasDespesas.status);

        const json = await dadosDasDespesas.json() as ResultadoBusca<DespesasDoDeputado[], DeputadosEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DespesasDoDeputado>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    async obterDiscursos() {

    };

    async obterEventos() {

    };

    async obterFrentes() {

    };

    async obterOcupacoes() {

    };

    async obterOrgaos() {

    };

    async obterProfissoes() {

    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<DeputadosOrdenarPor>>(url: DeputadosEndpointURL, opcoes?: T): DeputadosEndpointURL {
        if (!opcoes) return url;

        /** Chaves cujo valor devem ser arrays de números. */
        const numberArrayKeys: ReadonlyArray<DeputadosTodasOpcoes> = ['ano', 'mes','id', 'idLegislatura'];
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: ReadonlyArray<DeputadosTodasOpcoes> = ['cnpjCpfFornecedor', 'nome', 'ordem', 'ordenarPor', 'siglaSexo'];
        
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
    async #obterDadosProximaPagina<T extends DadosDosDeputados>(links: LinksNavegacao<DeputadosEndpointURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);
                APIError.handleStatus(proximaPagina.status);

                const proximoJson = await proximaPagina.json() as ResultadoBusca<T[], DeputadosEndpointURL>;
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