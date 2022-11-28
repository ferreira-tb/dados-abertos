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

        const status = APIError.handleStatus(dadosDosDeputados.status);
        if (status === false) return [];

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
     * 
     * Caso não exista um parlamentar associado ao ID, retorna `null`.
     * 
     * A API DA CÂMARA NÃO ESTÁ FUNCIONANDO - ERRO 500.
     */
     async obterUm(idDoDeputado: number): Promise<Deputado | null> {
        idDoDeputado = verificarID(idDoDeputado);

        const url = `${this.endpoint}/${idDoDeputado.toString(10)}`;
        const dadosDoDeputado = await fetch(url);

        const status = APIError.handleStatus(dadosDoDeputado.status);
        if (status === false) return null;

        const json = await dadosDoDeputado.json() as ResultadoBusca<Deputado, DeputadosEndpointURL>;
        return json.dados;
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<DeputadosOrdenarPor>>(url: DeputadosEndpointURL, opcoes?: T): DeputadosEndpointURL {
        if (!opcoes) return url;

        type Opcoes = keyof DeputadoEndpointOpcoes;
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: StringKeys<Opcoes> = ['nome', 'ordem', 'ordenarPor', 'siglaSexo'];
        
        for (const [key, value] of Object.entries(opcoes) as [Opcoes, unknown][]) {
            if (key === 'id' || key === 'idLegislatura' ) {
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
                
                const status = APIError.handleStatus(proximaPagina.status);
                if (status === false) return [];

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