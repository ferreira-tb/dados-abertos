import { APIError } from "../error.js";
import { verificarID } from "../common/helpers.js";

export default class BlocosPartidarios {
    /** URL para o endpoint dos blocos partidários. */
    readonly endpoint: BlocosEndpointURL = 'https://dadosabertos.camara.leg.br/api/v2/blocos';

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
    async obterTodos(opcoes?: BlocoEndpointOpcoes): Promise<DadosBasicosBloco[]> {
        const url = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const dadosDosBlocos = await fetch(url);
        if (dadosDosBlocos.status === 400 || dadosDosBlocos.status === 404) return [];

        const json = await dadosDosBlocos.json() as ResultadoBusca<DadosBasicosBloco[], BlocosEndpointURL>;
        if (Array.isArray(json.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosBloco>(json.links);
            if (dadosExtras.length > 0) json.dados.push(...dadosExtras);
            return json.dados;
        };

        return [];
    };

    /** 
     * Retorna informações sobre o bloco cujo ID corresponde ao fornecido.
     * 
     * Supõe-se que esse método devesse retornar informações mais detalhadas,
     * mas a API da Câmara dos Deputados ainda não fornece nada além dos dados básicos.
     * */
    async obterUm(idDoBloco: number): Promise<DadosBasicosBloco | null> {
        idDoBloco = verificarID(idDoBloco);

        const url = `${this.endpoint}/${idDoBloco.toString(10)}`;
        const dadosDoBloco = await fetch(url);
        if (dadosDoBloco.status === 400 || dadosDoBloco.status === 404) return null;

        const json = await dadosDoBloco.json() as ResultadoBusca<DadosBasicosBloco, BlocosEndpointURL>;
        return json.dados;
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL(urlBase: BlocosEndpointURL, opcoes?: BlocoEndpointOpcoes): BlocosEndpointURL {
        if (!opcoes) return urlBase;

        let url = urlBase;
        for (const [key, value] of Object.entries(opcoes) as [keyof BlocoEndpointOpcoes, unknown][]) {
            if (key === 'id' || key === 'idLegislatura' ) {
                if (!Array.isArray(value)) {
                    throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);
                };

                for (const item of value) {
                    const id = verificarID(item);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if (key === 'ordem' || key === 'ordenarPor') {
                if (typeof value !== 'string') {
                    throw new APIError(`${key} deveria ser uma string, mas é um(a) ${typeof value}`);
                };
                url += `&${key}=${value}`;
            
            } else {
                throw new APIError(`${key} não é uma opção válida.`);
            };
        };

        return url;
    };

    /** Obtém os dados da próxima página. */
     async #obterDadosProximaPagina<T extends DadosDosBlocos>(links: NavegacaoEntrePaginas<BlocosEndpointURL>[]): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await fetch(link.href);
                const proximoJson = await proximaPagina.json() as ResultadoBusca<T[], BlocosEndpointURL>;
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