import { verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

export default class FrentesParlamentares {
    /** URL para o endpoint das frentes parlamentares. */
    readonly endpoint: FrentesEndpointURL = 'https://dadosabertos.camara.leg.br/api/v2/frentes';

    /**
     * Retorna uma lista de informações sobre uma frente parlamentar,
     * que é um agrupamento oficial de parlamentares em torno de um determinado tema ou proposta.
     * 
     * As frentes existem até o fim da legislatura em que foram criadas,
     * e podem ser recriadas a cada legislatura.
     * Algumas delas são compostas por deputados e senadores.
     * 
     * Uma array com um ou mais números de legislaturas pode ser passada como parâmetro.
     * Se ela for omitida, a função retornada todas as frentes parlamentares criadas desde 2003.
     */
    async obterTodas(opcoes?: FrenteEndpointOpcoes): Promise<DadosBasicosFrente[]> {
        const url = this.#construirURL(this.endpoint, opcoes);
        const dadosDasFrentes = await fetch(url);
        APIError.handleStatus(dadosDasFrentes.status);

        const json = await dadosDasFrentes.json() as ResultadoBusca<DadosBasicosFrente[], FrentesEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosFrente>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** Retorna informações detalhadas sobre uma frente parlamentar. */
    async obterUma(idDaFrente: number): Promise<Frente> {
        idDaFrente = verificarID(idDaFrente);

        const url = `${this.endpoint}/${idDaFrente.toString(10)}`;
        const dadosDaFrente = await fetch(url);
        APIError.handleStatus(dadosDaFrente.status);

        const json = await dadosDaFrente.json() as ResultadoBusca<Frente, FrentesEndpointURL>;
        return json.dados;
    };

    /** Retorna uma lista com os deputados que participam de uma frente parlamentar. */
    async obterMembros(idDaFrente: number): Promise<MembroDaFrente[]> {
        idDaFrente = verificarID(idDaFrente);

        const url: FrentesEndpointURL = `${this.endpoint}/${idDaFrente.toString(10)}/membros`;
        const membrosDoPartido = await fetch(url);
        APIError.handleStatus(membrosDoPartido.status);

        const json = await membrosDoPartido.json() as ResultadoBusca<MembroDaFrente[], FrentesEndpointURL>;
        if (Array.isArray(json.dados)) return json.dados;

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL(url: FrentesEndpointURL, opcoes?: FrenteEndpointOpcoes): FrentesEndpointURL {
        if (!opcoes) return url;

        for (const [key, value] of Object.entries(opcoes) as [FrentesTodasOpcoes, unknown][]) {
            if (key === 'idLegislatura') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else {
                throw new APIError(`${key} não é uma opção válida.`);
            };
        };

        return url;
    };

    /** Obtém os dados da próxima página. */ 
    async #obterDadosProximaPagina<T extends DadosBasicosFrente>(links: LinksNavegacao<FrentesEndpointURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (typeof link.href !== 'string') throw new APIError('O link para a próxima página é inválido');
                const linkCorrigido = this.#removerParametrosInvalidos(link.href);
                const proximaPagina = await fetch(linkCorrigido);
                APIError.handleStatus(proximaPagina.status);

                const proximoJson = await proximaPagina.json() as ResultadoBusca<T[], FrentesEndpointURL>;
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

    /**
     * Solução temporária para o problema descrito na issue a seguir.
     * https://github.com/CamaraDosDeputados/dados-abertos/issues/326
     * @param link Link para a próxima página.
     */
    #removerParametrosInvalidos(link: NavegacaoEntrePaginas<FrentesEndpointURL>['href']) {
        if (!link.includes('itens')) return link;
        return link.replace('&itens=1000', '') as typeof link;
    };
};