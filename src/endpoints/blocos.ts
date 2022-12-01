import { APIError } from "../error.js";
import { obter, verificarID } from "../common/helpers.js";

import type {
    BlocosURL,
    BlocoOpcoes,
    DadosBasicosBloco,
    BlocosTodasOpcoes,
    DadosDosBlocos,
    LinksNavegacao
} from "../../index.js";

export class BlocosPartidarios {
    /** URL para o endpoint dos blocos partidários. */
    readonly endpoint: BlocosURL = 'https://dadosabertos.camara.leg.br/api/v2/blocos';

    /**
     * Nas atividades parlamentares, partidos podem se juntar em blocos partidários.
     * Quando associados, os partidos passam a trabalhar como se fossem um "partidão",
     * com um só líder e um mesmo conjunto de vice-líderes.
     * 
     * Os blocos só podem existir até o fim da legislatura em que foram criados:
     * na legislatura seguinte, os mesmos partidos, se associados, formam um novo bloco.
     * 
     * A função retorna uma lista dos blocos em atividade no momento.
     * Se forem passados números de legislaturas com o parâmetro `idLegislatura`,
     * são listados também os blocos formados e extintos nessas legislaturas.
     */
    async obterTodos(opcoes?: BlocoOpcoes): Promise<DadosBasicosBloco[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);

        const blocos = await obter<DadosBasicosBloco[], BlocosURL>(url);
        if (Array.isArray(blocos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosBloco>(blocos.links);
            if (dadosExtras.length > 0) blocos.dados.push(...dadosExtras);
            return blocos.dados;
        };

        return [];
    };

    /** Retorna informações sobre o bloco cujo ID corresponde ao fornecido. */
    async obterUm(idDoBloco: number): Promise<DadosBasicosBloco> {
        idDoBloco = verificarID(idDoBloco);

        const url: BlocosURL = `${this.endpoint}/${idDoBloco.toString(10)}`;
        const bloco = await obter<DadosBasicosBloco, BlocosURL>(url);
        return bloco.dados;
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL(url: BlocosURL, opcoes?: BlocoOpcoes): BlocosURL {
        if (!opcoes) return url;

        /** Chaves cujo valor devem ser strings. */
        const stringKeys: ReadonlyArray<BlocosTodasOpcoes> = ['ordem', 'ordenarPor'];
        
        for (const [key, value] of Object.entries(opcoes) as [BlocosTodasOpcoes, unknown][]) {
            if (key === 'id' || key === 'idLegislatura' ) {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
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
    async #obterDadosProximaPagina<T extends DadosDosBlocos>(links: LinksNavegacao<BlocosURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], BlocosURL>(link.href);
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