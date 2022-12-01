import { obter, verificarData, verificarHora, verificarID } from "../common/helpers.js";
import { APIError } from "../error.js";

import type {
    EventosURL,
    EventoOpcoes,
    DadosBasicosEvento,
    Evento,
    DeputadosNoEvento,
    OrgaosDoEvento,
    PautaDoEvento,
    DadosBasicosVotacao,
    EndpointOpcoes,
    EventosOrdenarPor,
    EventosTodasOpcoes,
    DadosDosEventos,
    LinksNavegacao
} from "../../index.js";

export class Eventos {
    /** URL para o endpoint dos eventos. */
    readonly endpoint: EventosURL = 'https://dadosabertos.camara.leg.br/api/v2/eventos';

    /**
     * Retorna uma lista cujos elementos trazem informações básicas sobre eventos
     * dos órgãos legislativos da Câmara, previstos ou já ocorridos, em um certo intervalo de tempo.
     * 
     * Esse intervalo pode ser configurado por parâmetros de data e hora.
     * Se nenhum parâmetro do tipo for passado, são listados eventos dos cinco dias anteriores,
     * dos cinco dias seguintes e do próprio dia em que é feita a requisição.
     */
    async obterTodos(opcoes?: EventoOpcoes): Promise<DadosBasicosEvento[]> {
        const url: EventosURL = this.#construirURL(`${this.endpoint}?itens=100`, opcoes);
        const eventos = await obter<DadosBasicosEvento[], EventosURL>(url);
        if (Array.isArray(eventos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosEvento>(eventos.links);
            if (dadosExtras.length > 0) eventos.dados.push(...dadosExtras);
            return eventos.dados;
        };

        return [];
    };

    /** Retorna um conjunto detalhado de informações sobre o evento. */
    async obterUm(idDoEvento: number): Promise<Evento> {
        idDoEvento = verificarID(idDoEvento);

        const url: EventosURL = `${this.endpoint}/${idDoEvento.toString(10)}`;
        const evento = await obter<Evento, EventosURL>(url);
        return evento.dados;
    };

    /**
     * Retorna uma lista de dados resumidos sobre deputados participantes do evento.
     * 
     * Se o evento já ocorreu, a lista identifica os deputados que efetivamente registraram presença no evento.
     * Se o evento ainda não ocorreu, a lista mostra os deputados que devem participar do evento,
     * por serem convidados ou por serem membros dos órgãos responsáveis pelo evento.
     */
    async obterDeputados(idDoEvento: number): Promise<DeputadosNoEvento[]> {
        idDoEvento = verificarID(idDoEvento);

        const url: EventosURL = `${this.endpoint}/${idDoEvento.toString(10)}/deputados`;
        const deputados = await obter<DeputadosNoEvento[], EventosURL>(url);
        if (Array.isArray(deputados.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DeputadosNoEvento>(deputados.links);
            if (dadosExtras.length > 0) deputados.dados.push(...dadosExtras);
            return deputados.dados;
        };

        return [];
    };

    /** Retorna uma lista em que cada item é um conjunto mínimo de dados sobre os órgãos responsáveis pelo evento. */
    async obterOrgaos(idDoEvento: number): Promise<OrgaosDoEvento[]> {
        idDoEvento = verificarID(idDoEvento);

        const url: EventosURL = `${this.endpoint}/${idDoEvento.toString(10)}/orgaos`;
        const orgaos = await obter<OrgaosDoEvento[], EventosURL>(url);
        if (Array.isArray(orgaos.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<OrgaosDoEvento>(orgaos.links);
            if (dadosExtras.length > 0) orgaos.dados.push(...dadosExtras);
            return orgaos.dados;
        };

        return [];
    };

    /**
     * Se o evento for de caráter deliberativo (uma reunião ordinária, por exemplo) este método
     * retorna a lista de proposições previstas para avaliação pelos parlamentares.
     * 
     * Cada item identifica, se as informações estiverem disponíveis, a proposição avaliada,
     * o regime de preferência para avaliação, o relator e seu parecer, o resultado da apreciação e a votação realizada.
     */
    async obterPautas(idDoEvento: number): Promise<PautaDoEvento[]> {
        idDoEvento = verificarID(idDoEvento);

        const url: EventosURL = `${this.endpoint}/${idDoEvento.toString(10)}/pauta`;
        const pautas = await obter<PautaDoEvento[], EventosURL>(url);
        if (Array.isArray(pautas.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<PautaDoEvento>(pautas.links);
            if (dadosExtras.length > 0) pautas.dados.push(...dadosExtras);
            return pautas.dados;
        };

        return [];
    };

    /**
     * Retorna uma lista de dados básicos sobre votações que tenham sido realizadas no evento.
     * Votações só ocorrem em eventos de caráter deliberativo.
     * 
     * Dados complementares sobre cada votação listada podem ser obtidos através do método `Votacoes.prototype.obterUm()`.
     * 
     * Para compreender melhor os dados sobre votações, veja a página de tutorial do Portal de Dados Abertos.
     * https://dadosabertos.camara.leg.br/howtouse/2020-02-07-dados-votacoes.html
     */
    async obterVotacoes(idDoEvento: number): Promise<DadosBasicosVotacao[]> {
        idDoEvento = verificarID(idDoEvento);

        const url: EventosURL = `${this.endpoint}/${idDoEvento.toString(10)}/votacoes`;
        const votacoes = await obter<DadosBasicosVotacao[], EventosURL>(url);
        if (Array.isArray(votacoes.dados)) {
            const dadosExtras = await this.#obterDadosProximaPagina<DadosBasicosVotacao>(votacoes.links);
            if (dadosExtras.length > 0) votacoes.dados.push(...dadosExtras);
            return votacoes.dados;
        };

        return [];
    };

    /** Constrói a URL com base nos parâmetros fornecidos. */
    #construirURL<T extends EndpointOpcoes<EventosOrdenarPor>>(url: EventosURL, opcoes?: T): EventosURL {
        if (!opcoes) return url;

        type OpcoesPossiveis = ReadonlyArray<EventosTodasOpcoes>;
        /** Chaves cujo valor devem ser arrays de números. */
        const numberArrayKeys: OpcoesPossiveis = ['id', 'codTipoEvento', 'codSituacao', 'codTipoOrgao', 'idOrgao'];
        /** Chaves cujo valor devem ser strings. */
        const stringKeys: OpcoesPossiveis = ['ordem', 'ordenarPor'];
        
        for (const [key, value] of Object.entries(opcoes) as [EventosTodasOpcoes, unknown][]) {
            if (numberArrayKeys.includes(key)) {
                if (!Array.isArray(value)) throw new APIError(`${key} deveria ser uma array, mas é um(a) ${typeof value}`);

                for (const numero of value) {
                    const id = verificarID(numero);
                    url += `&${key}=${id.toString(10)}`;
                };

            } else if ((key === 'dataInicio' || key === 'dataFim') && verificarData(value)) {
                url += `&${key}=${value}`;

            } else if ((key === 'horaInicio' || key === 'horaFim') && verificarHora(value)) {
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
    async #obterDadosProximaPagina<T extends DadosDosEventos>(links: LinksNavegacao<EventosURL>): Promise<T[]> {
        let dados: T[] = [];
        for (const link of links) {
            if (link.rel === 'next') {
                if (!link.href) throw new APIError('O link para a próxima página é inválido');
                const proximaPagina = await obter<T[], EventosURL>(link.href);
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