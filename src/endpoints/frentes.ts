import { obter, verificarInteiro } from "../common/helpers.js";
import { APIError } from "../error.js";

import type {
    FrentesURL,
    FrenteOpcoes,
    DadosBasicosFrente,
    Frente,
    MembroDaFrente,
    FrentesTodasOpcoes,
    LinksNavegacao,
    NavegacaoEntrePaginas
} from "../../index.js";

export class FrentesParlamentares {
    /** URL para o endpoint das frentes parlamentares. */
    readonly endpoint: FrentesURL = 'https://dadosabertos.camara.leg.br/api/v2/frentes';

    /**
     * Retorna uma lista de informações sobre uma frente parlamentar,
     * que é um agrupamento oficial de parlamentares em torno de um determinado tema ou proposta.
     * 
     * As frentes existem até o fim da legislatura em que foram criadas, e podem ser recriadas a cada legislatura.
     * Algumas delas são compostas por deputados e senadores.
     * 
     * Uma array com um ou mais números de legislaturas pode ser passada como opção.
     * Se ela for omitida, a função retorna todas as frentes parlamentares criadas desde 2003.
     */
    async obterTodas(opcoes?: FrenteOpcoes): Promise<DadosBasicosFrente[]> {
        const url = this.#construirURL(this.endpoint, opcoes);

        const frentes = await obter<DadosBasicosFrente[], FrentesURL>(url);
        if (Array.isArray(frentes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosFrente>(frentes.links);
            if (dadosExtras.length > 0) frentes.dados.push(...dadosExtras);
            return frentes.dados;
        };

        return [];
    };

    /** Retorna informações detalhadas sobre uma frente parlamentar. */
    async obterUma(idDaFrente: number): Promise<Frente> {
        idDaFrente = verificarInteiro(idDaFrente);

        const url: FrentesURL = `${this.endpoint}/${idDaFrente.toString(10)}`;
        const frente = await obter<Frente, FrentesURL>(url);
        return frente.dados;
    };

    /**
     * Uma lista dos deputados participantes da frente parlamentar
     * e os papéis que exerceram nessa frente (signatário, coordenador ou presidente).
     * 
     * Observe que, mesmo no caso de frentes parlamentares mistas (compostas por deputados e senadores),
     * são retornados apenas dados sobre os deputados.
     */
    async obterMembros(idDaFrente: number): Promise<MembroDaFrente[]> {
        idDaFrente = verificarInteiro(idDaFrente);

        const url: FrentesURL = `${this.endpoint}/${idDaFrente.toString(10)}/membros`;
        const membros = await obter<MembroDaFrente[], FrentesURL>(url);

        if (Array.isArray(membros.dados)) return membros.dados;
        return [];
    };

    /** Constrói a URL com base nas opções fornecidas. */
    #construirURL(url: FrentesURL, opcoes?: FrenteOpcoes): FrentesURL {
        if (!opcoes) return url;

        for (const [key, value] of Object.entries(opcoes) as [FrentesTodasOpcoes, unknown][]) {
            if (key === 'idLegislatura') {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarInteiro(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else {
                throw new APIError(`${key} não é uma opção válida.`);
            };
        };

        return url;
    };

    /** Obtém os dados da próxima página. */ 
    async #obterDadosProximaPagina<T extends DadosBasicosFrente>(links: LinksNavegacao<FrentesURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (typeof link.href !== 'string') throw new APIError('O link para a próxima página é inválido');
                const linkCorrigido = this.#removerParametrosInvalidos(link.href);
                const proximaPagina = await obter<T[], FrentesURL>(linkCorrigido);
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

    /**
     * Solução temporária para o problema descrito na issue a seguir.
     * https://github.com/CamaraDosDeputados/dados-abertos/issues/326
     * @param link Link para a próxima página.
     */
    #removerParametrosInvalidos(link: NavegacaoEntrePaginas<FrentesURL>['href']) {
        if (!link.includes('itens')) return link;
        return link.replace('&itens=1000', '') as typeof link;
    };
};