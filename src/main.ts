export * from './endpoints/blocos.js';
export * from './endpoints/deputados.js';
export * from './endpoints/eventos.js';
export * from './endpoints/frentes.js';
export * from './endpoints/legislaturas.js';
export * from './endpoints/partidos.js';
export * from './endpoints/proposicoes.js';
export * from './endpoints/orgaos.js';
export * from './endpoints/votacoes.js';

////// GLOBAL
type UnidadeFederativa =
    | 'AC' // Acre
    | 'AL' // Alagoas
    | 'AP' // Amapá
    | 'AM' // Amazonas
    | 'BA' // Bahia
    | 'CE' // Ceará
    | 'DF' // Distrito Federal
    | 'ES' // Espírito Santo
    | 'GO' // Goiás
    | 'MA' // Maranhão
    | 'MT' // Mato Grosso
    | 'MS' // Mato Grosso do Sul
    | 'MG' // Minas Gerais
    | 'PA' // Pará
    | 'PB' // Paraíba
    | 'PR' // Paraná
    | 'PE' // Pernambuco
    | 'PI' // Piauí
    | 'RJ' // Rio de Janeiro
    | 'RN' // Rio Grande do Norte
    | 'RS' // Rio Grande do Sul
    | 'RO' // Rondônia
    | 'RR' // Roraima
    | 'SC' // Santa Catarina
    | 'SP' // São Paulo
    | 'SE' // Sergipe
    | 'TO' // Tocantins

////// ENDPOINTS
export type CamaraEndpoints =
    | BlocosURL
    | DeputadosURL
    | EventosURL
    | FrentesURL
    | LegislaturasURL
    | OrgaosURL
    | PartidosURL
    | ProposicoesURL
    | ReferenciasURL
    | VotacoesURL

type VersaoAPI = 'v2';
type EndpointURLBase = `https://dadosabertos.camara.leg.br/api/${VersaoAPI}`;

export type BlocosURL = `${EndpointURLBase}/blocos${string}`;
export type DeputadosURL = `${EndpointURLBase}/deputados${string}`;
export type EventosURL = `${EndpointURLBase}/eventos${string}`;
export type FrentesURL = `${EndpointURLBase}/frentes${string}`;
export type LegislaturasURL = `${EndpointURLBase}/legislaturas${string}`;
export type OrgaosURL = `${EndpointURLBase}/orgaos${string}`;
export type PartidosURL = `${EndpointURLBase}/partidos${string}`;
export type ProposicoesURL = `${EndpointURLBase}/proposicoes${string}`;
export type ReferenciasURL = `${EndpointURLBase}/referencias${string}`;
export type VotacoesURL = `${EndpointURLBase}/votacoes${string}`;

////// BUSCA
export type LinksNavegacao<L> = ReadonlyArray<NavegacaoEntrePaginas<L>>;

export type ResultadoBusca<D, L> = {
    readonly dados: D
    readonly links: LinksNavegacao<L>
}

export type NavegacaoEntrePaginas<L> = {
    /** Relação com a página atual. */
    readonly rel: 'first' | 'last' | 'next' | 'self'
    /** Link para a nova página. */
    readonly href: L
}

////// DADOS
export type TodosDados = 
    | DadosDosBlocos
    | DadosDosDeputados
    | DadosDosEventos
    | DadosDasFrentes
    | DadosDasLegislaturas
    | DadosDosOrgaos
    | DadosDosPartidos
    | DadosDasProposicoes
    | DadosDasVotacoes

////// ORDENAR POR
/** ID, nome e legislatura. */
type OrdenarBlocos = 'id' | 'nome' | 'idLegislatura';
/** ID, nome, legislatura, sigla da unidade federativa e sigla do partido. */
type OrdenarDeputados = 'id' | 'nome' | 'idLegislatura' | 'siglaUf' | 'siglaPartido';
/** Legislatura ou qualquer chave do objeto. */
type OrdenarDeputadosDespesas = keyof DespesasDoDeputado | 'idLegislatura';
/** Data e hora iniciais. */
type OrdenarDeputadosDiscursos = 'dataHoraInicio';
/** ID, data e hora iniciais e a sigla do órgão. */
type OrdenarDeputadosEventos = 'id' | 'dataHoraInicio' | 'siglaOrgao';
/** ID, sigla e nome do orgão, além do título e as datas de início e fim. */
type OrdenarDeputadosOrgaos = 'dataInicio' | 'dataFim' | 'idOrgao' | 'siglaOrgao' | 'nomeOrgao' | 'titulo';
/** ID, data e hora, descrição e título. */
type OrdenarEventos = 'id' | 'dataHoraInicio' | 'dataHoraFim' | 'descricaoSituacao' | 'descricaoTipo' | 'titulo';
/** Não há ordenação para as frentes parlamentares. */
type OrdenarFrentes = never;
/** ID da legislatura. */
type OrdenarLegislaturas = 'id';
/** ID, sigla, nome, apelido, tipo ou código do tipo do órgão, além da data. */
type OrdenarOrgaos = 'id' | 'sigla' | 'nome' | 'apelido' | 'codTipoOrgao' | 'tipoOrgao' | 'dataInicio' | 'dataFim';
/** ID, horários inicial e final, além da descriação do tipo de evento. */
type OrdenarOrgaosEventos = 'id' | 'dataHoraInicio' | 'dataHoraFim' | 'descricaoTipo';
/** ID da votação, do evento ou da proposição, sigla ou ID do orgão, além de data e horário de registro. */
type OrdenarOrgaosVotacoes =
    | 'id'
    | 'idOrgao'
    | 'siglaOrgao'
    | 'idEvento'
    | 'idProposicao'
    | 'data'
    | 'dataHoraRegistro'
    | 'idProposicaoObjeto';

/** ID, nome, sigla, data inicial e data final. */
type OrdenarPartidos = 'id' | 'nome' | 'dataInicio' | 'dataFim' | 'sigla';
/** ID, nome e sigla da unidade federativa. */
type OrdenarPartidosMembros = 'id' | 'nome' | 'siglaUf';
/** ID, código e sdo tipo da proposição, */
type OrdenarProposicoes = 'id' | 'codTipo' | 'siglaTipo' | 'numero' | 'ano';
/** ID e horário do registro. */
type OrdenarProposicoesVotacao = 'id' | 'dataHoraRegistro';
/** Diferentes tipos de ID, sigla do orgão, data e hora.*/
type OrdenarVotacoes =
    | 'id'
    | 'idOrgao'
    | 'siglaOrgao'
    | 'idEvento'
    | 'idProposicao'
    | 'data'
    | 'dataHoraRegistro '
    | 'idProposicaoObjeto';

// União dos tipos usados por diferentes partes de um mesmo endpoint.
// Os tipos resultantes então são usados como constraint em alguns métodos.
export type BlocosOrdenarPor = OrdenarBlocos;
export type DeputadosOrdenarPor =
    | OrdenarDeputados
    | OrdenarDeputadosDespesas
    | OrdenarDeputadosDiscursos
    | OrdenarDeputadosEventos
    | OrdenarDeputadosOrgaos;

export type EventosOrdenarPor = OrdenarEventos;
export type FrentesOrdenarPor = OrdenarFrentes;
export type LegislaturasOrdenarPor = OrdenarLegislaturas;
export type OrgaosOrdenarPor = OrdenarOrgaos | OrdenarOrgaosEventos | OrdenarOrgaosVotacoes;
export type PartidosOrdenarPor = OrdenarPartidos | OrdenarPartidosMembros;
export type ProposicoesOrdenarPor = OrdenarProposicoes | OrdenarProposicoesVotacao;
export type ReferenciasOrdenarPor = '';
export type VotacoesOrdenarPor = OrdenarVotacoes;

////// OPÇÕES
export type EndpointOpcoes<O> = {
    /**
     * Data de início de um intervalo de tempo, no formato `AAAA-MM-DD`.
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    dataInicio?: string | Date
    /**
     * Data de término de um intervalo de tempo, no formato `AAAA-MM-DD`.
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    dataFim?: string | Date
    /** Número das legislaturas às quais os dados buscados devem corresponder. */
    idLegislatura?: number[]
    /** O sentido da ordenação: `asc` para A a Z ou 0 a 9, e `desc` para Z a A ou 9 a 0. */
    ordem?: 'asc' | 'desc'
    /** Nome do campo pelo qual a lista deve ser ordenada. */
    ordenarPor?: O
}

export type BlocosTodasOpcoes = keyof BlocoOpcoes;
export type DeputadosTodasOpcoes = keyof DeputadoOpcoes | keyof DeputadoDespesasOpcoes | keyof DeputadoDiscursosOpcoes;
export type EventosTodasOpcoes = keyof EventoOpcoes;
export type FrentesTodasOpcoes = keyof FrenteOpcoes;
export type LegislaturasTodasOpcoes = keyof LegislaturaOpcoes | keyof LegislaturaMesaOpcoes;
export type OrgaosTodasOpcoes = keyof OrgaoOpcoes | keyof OrgaoEventoOpcoes | keyof OrgaoMembroOpcoes | keyof OrgaoVotacaoOpcoes;
export type PartidosTodasOpcoes = keyof PartidoOpcoes;
export type ProposicoesTodasOpcoes = keyof ProposicaoOpcoes | keyof ProposicaoTramitacaoOpcoes;
export type ReferenciasTodasOpcoes = never;
export type VotacoesTodasOpcoes = keyof VotacaoOpcoes;

////// BLOCOS
export type DadosDosBlocos =
    | DadosBasicosBloco

export interface BlocoOpcoes extends Omit<EndpointOpcoes<OrdenarBlocos>, 'dataInicio' | 'dataFim'> {
    /** ID de um ou mais blocos partidários. */
    id?: number[]
}

export type DadosBasicosBloco = {
    /** ID do bloco partidário. */
    readonly id: string
    /** Siglas dos partidos associados. */
    readonly nome: string
    /** ID da legislatura. */
    readonly idLegislatura: string
    readonly uri: BlocosURL
}

////// DEPUTADOS
export type DadosDosDeputados =
    | DadosBasicosDeputado
    | Deputado
    | DespesasDoDeputado
    | DiscursosDoDeputado
    | EventosDoDeputado
    | FrentesDoDeputado
    | OcupacoesDoDeputado
    | OrgaosDoDeputado
    | ProfissoesDoDeputado

export interface DeputadoOpcoes extends EndpointOpcoes<OrdenarDeputados> {
    /** ID de um ou mais parlamentares. */
    id?: number[]
    /** Nome do parlamentar. */
    nome?: string
    /**
     * Uma ou mais siglas de partidos aos quais sejam filiados os deputados.
     * Atenção: partidos diferentes podem usar a mesma sigla em diferentes legislaturas!
     */
    siglaPartido?: string[]
    /**
     * Letra que designe o sexo dos parlamentares que se deseja buscar,
     * sendo F para feminino e M para masculino.
     */
    siglaSexo?: 'F' | 'M'
    /**
     * Uma ou mais siglas de unidades federativas (estados e Distrito Federal).
     * Se ausente, serão retornados deputados de todos os estados.
     */
    siglaUf?: UnidadeFederativa[]
}

/** Pode ser ordenado por qualquer chave do tipo `DespesasDoDeputado`, além de `idLegislatura`. */
export interface DeputadoDespesasOpcoes extends Omit<EndpointOpcoes<OrdenarDeputadosDespesas>, 'dataInicio' | 'dataFim'> {
    /** Um ou mais anos de ocorrência das despesas. */
    ano?: number[]
    /** Um ou mais números dos meses de ocorrência das despesas. */
    mes?: number[]
    /** 
     * CNPJ de uma pessoa jurídica, ou CPF de uma pessoa física,
     * fornecedora do produto ou serviço (apenas números).
     * */
    cnpjCpfFornecedor?: string
}

export type DeputadoDiscursosOpcoes = EndpointOpcoes<OrdenarDeputadosDiscursos>;
export type DeputadoEventosOpcoes = Omit<EndpointOpcoes<OrdenarDeputadosEventos>, 'idLegislatura'>;
export type DeputadoOrgaosOpcoes = Omit<EndpointOpcoes<OrdenarDeputadosOrgaos>, 'idLegislatura'>;

// Interfaces que dependem dessa:
// CoordenadorDaFrente, DeputadosNoEvento, LideresDaLegislatura, MembroDoOrgao,
// MembroDoPartido, MesaDaLegislatura, PautaDoEvento, StatusDoDeputado.
export type DadosBasicosDeputado = {
    readonly id: number
    readonly uri: DeputadosURL
    readonly nome: string
    readonly siglaPartido: string | null
    readonly uriPartido: PartidosURL | null
    readonly siglaUf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string
    readonly email: string | null
}

/** Informações detalhadas sobre um deputado específico. */
export type Deputado = {
    readonly cpf: string
    readonly dataFalecimento: string | null
    readonly dataNascimento: string
    readonly escolaridade: string
    readonly id: number
    readonly municipioNascimento: string
    readonly nomeCivil: string
    readonly redeSocial: ReadonlyArray<string>
    readonly sexo: 'F' | 'M'
    readonly ufNascimento: UnidadeFederativa
    readonly ultimoStatus: StatusDoDeputado
    readonly uri: DeputadosURL
    readonly urlWebsite: string | null
}

interface StatusDoDeputado extends DadosBasicosDeputado {
    readonly condicaoEleitoral: string
    readonly data: string
    /** Quando não existente, pode aparecer como uma string vazia ou como `null`. */
    readonly descricaoStatus: string | null
    readonly gabinete: GabineteDoDeputado
    readonly nomeEleitoral: string
    readonly situacao: string
}

type GabineteDoDeputado = {
    readonly andar: string
    readonly email: string
    readonly nome: string
    readonly predio: string
    readonly sala: string
    readonly telefone: string
}

/** As despesas com exercício parlamentar do deputado. */
export type DespesasDoDeputado = {
    readonly ano: number
    readonly cnpjCpfFornecedor: string
    readonly codDocumento: number
    readonly codLote: number
    readonly codTipoDocumento: number
    readonly dataDocumento: string
    readonly mes: number
    readonly nomeFornecedor: string
    readonly numDocumento: string
    readonly numRessarcimento: string
    readonly parcela: number
    readonly tipoDespesa: string
    readonly tipoDocumento: string
    readonly urlDocumento: string | null
    readonly valorDocumento: number
    readonly valorGlosa: number
    readonly valorLiquido: number
}

/** Discursos feitos por um deputado em eventos diversos. */
export type DiscursosDoDeputado = {
    readonly dataHoraFim: string | null
    readonly dataHoraInicio: string
    readonly faseEvento: FaseEvento
    readonly keywords: string
    readonly sumario: string
    readonly tipoDiscurso: string
    readonly transcricao: string
    readonly uriEvento: string
    readonly urlAudio: string | null
    readonly urlTexto: string
    readonly urlVideo: string | null
}

/** Uma lista de eventos com a participação do parlamentar. */
export type EventosDoDeputado = {
    readonly dataHoraFim: string
    readonly dataHoraInicio: string
    readonly descricao: string
    readonly descricaoTipo: string
    readonly id: number
    readonly localCamara: LocalCamara
    readonly localExterno: string | null
    readonly orgaos: ReadonlyArray<DadosBasicosOrgao>
    readonly situacao: string
    readonly uri: string
    readonly urlRegistro: string | null
}

/** As frentes parlamentares das quais um deputado é integrante. */
export type FrentesDoDeputado = DadosBasicosFrente;

/** Os empregos e atividades que o deputado já teve. */
export type OcupacoesDoDeputado = {
    readonly anoFim: number | null
    readonly anoInicio: number | null
    readonly entidade: string | null
    readonly entidadePais: string | null
    readonly entidadeUF: string | null
    readonly titulo: string
}

/** Os órgãos dos quais um deputado é integrante. */
export type OrgaosDoDeputado = {
    readonly codTitulo: string
    readonly dataFim: string | null
    readonly dataInicio: string
    readonly idOrgao: number
    readonly nomeOrgao: string
    readonly nomePublicacao: string
    readonly siglaOrgao: string
    readonly titulo: string
    readonly uriOrgao: string
}

/** As profissões que o parlamentar declarou à Câmara que já exerceu ou
 * que pode exercer pela sua formação e/ou experiência. */
export type ProfissoesDoDeputado = {
    readonly dataHora: string
    readonly codTipoProfissao: number
    readonly titulo: string
}

////// EVENTOS
export type DadosDosEventos =
    | DadosBasicosEvento
    | Evento
    | DeputadosNoEvento
    | OrgaosDoEvento
    | PautaDoEvento
    | DadosBasicosVotacao

export type DadosBasicosEvento = {
    readonly id: number
    readonly uri: EventosURL
    readonly dataHoraInicio: string
    readonly dataHoraFim: string | null
    readonly situacao: string
    readonly descricaoTipo: string
    readonly descricao: string
    readonly localExterno: string | null
    readonly orgaos: ReadonlyArray<DadosBasicosOrgao>
    readonly localCamara: LocalCamara
    readonly urlRegistro: string | null
}

/** Representa eventos ocorridos ou previstos nos diversos órgãos da Câmara. */
export interface Evento extends DadosBasicosEvento {
    readonly uriDeputados: null
    readonly uriConvidados: null
    readonly fases: null
    readonly requerimentos: ReadonlyArray<Requerimento>
    readonly urlDocumentoPauta: EventosURL
}

export interface EventoOpcoes extends Omit<EndpointOpcoes<OrdenarEventos>, 'idLegislatura'> {
    /** ID de um ou mais eventos. */
    id?: number[]
    /** ID dos tipos de evento. */
    codTipoEvento?: number[]
    /** ID de tipos de situação de evento. */
    codSituacao?: number[]
    /** ID dos tipos de órgãos realizadores dos eventos. */
    codTipoOrgao?: number[]
    /** ID dos órgãos. */
    idOrgao?: number[]
    /**
     * Hora inicial, no formato `HH:MM`.
     * 
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    horaInicio?: string | Date
    /**
     * Hora de término, no formato `HH:MM`.
     * 
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    horaFim?: string | Date
}

/** Deputados participantes de um evento específico. */
export type DeputadosNoEvento = ReadonlyArray<DadosBasicosDeputado>;
/** Órgãos organizadores do evento. */
export type OrgaosDoEvento = ReadonlyArray<DadosBasicosOrgao>;

export type PautaDoEvento = {
    readonly ordem: number
    readonly topico: string
    readonly regime: string
    readonly codRegime: number
    readonly titulo: string
    readonly proposicao_: DadosBasicosProposicao
    readonly relator: DadosBasicosDeputado
    readonly textoParecer: string | null
    readonly proposicaoRelacionada_: ProposicaoRelacionada
    readonly uriVotacao: string | null
    readonly situacaoItem: string | null
}

type Requerimento = {
    readonly titulo: string;
    readonly uri: ProposicoesURL
}

type LocalCamara = {
    readonly andar: string | null
    readonly nome: string | null
    readonly predio: string | null
    readonly sala: string | null
}

// Tipos que dependem desse:
// DiscursosDoDeputado
type FaseEvento = {
    readonly dataHoraFim: string | null
    readonly dataHoraInicio: string | null
    readonly titulo: string
}

////// FRENTES
export type DadosDasFrentes =
    | DadosBasicosFrente
    | Frente
    | MembroDaFrente

export type DadosBasicosFrente = {
    readonly id: number
    readonly uri: FrentesURL
    readonly titulo: string
    readonly idLegislatura: number
}

export interface Frente extends DadosBasicosFrente {
    readonly telefone: string
    readonly email: string | null
    readonly keywords: string | null
    readonly idSituacao: null
    readonly situacao: string
    readonly urlWebsite: string | null
    readonly urlDocumento: string | null
    readonly coordenador: CoordenadorDaFrente
}

export type CoordenadorDaFrente = {
    [key in keyof DadosBasicosDeputado]: DadosBasicosDeputado[key] | null;
}

export interface FrenteOpcoes extends Pick<EndpointOpcoes<OrdenarFrentes>, 'idLegislatura'> { }

export type TipoBaseMembroDaFrente = {
    readonly id: number
    readonly uri: DeputadosURL
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: PartidosURL
    readonly siglaUf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string | null
    readonly email: string | null
    readonly titulo: string
    readonly codTitulo: number
    readonly dataInicio: string | null
    readonly dataFim: string | null
}

/** Representa um deputado que faz parte de uma frente parlamentar. */
export type MembroDaFrente = {
    [key in keyof TipoBaseMembroDaFrente]: TipoBaseMembroDaFrente[key] | null;
}

////// LEGISLATURAS
export type DadosDasLegislaturas =
    | DadosBasicosLegislatura
    | Legislatura
    | LideresDaLegislatura
    | MesaDaLegislatura

export type DadosBasicosLegislatura = {
    readonly id: number
    readonly uri: LegislaturasURL
    readonly dataInicio: string
    readonly dataFim: string
}

export type Legislatura = DadosBasicosLegislatura;

export interface LegislaturaOpcoes extends Pick<EndpointOpcoes<OrdenarLegislaturas>, 'ordem' | 'ordenarPor'> {
    /**
     * Data no formato `AAAA-MM-DD`. Se esta opção estiver presente,
     * a requisição retornará as informações básicas sobre a legislatura em curso na data fornecida.
     * 
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    data?: string | Date;
    /** ID de uma ou mais legislaturas. */
    id?: number[]
}

export type LegislaturaMesaOpcoes = Pick<EndpointOpcoes<never>, 'dataInicio' | 'dataFim'>;

/** Líderes, vice-líderes e representantes na legislatura. */
export type LideresDaLegislatura = {
    readonly parlamentar: DadosBasicosDeputado
    readonly titulo: string
    readonly dataInicio: string
    readonly dataFim: string
}

export interface MesaDaLegislatura extends DadosBasicosDeputado {
    readonly dataInicio: string
    readonly dataFim: string
    readonly titulo: string
    readonly codTitulo: string
}

////// ORGÃOS
export type DadosDosOrgaos =
    | DadosBasicosOrgao
    | Orgao
    | DadosBasicosEvento
    | MembroDoOrgao
    | DadosBasicosVotacao

// Interfaces que dependem dessa:
// DadosBasicosEvento, EventosDoDeputado, OrgaosDoEvento.
export type DadosBasicosOrgao = {
    readonly id: number
    readonly uri: OrgaosURL
    readonly sigla: string
    readonly nome: string
    readonly apelido: string
    readonly codTipoOrgao: number
    readonly tipoOrgao: string
    readonly nomePublicacao: string | null
    readonly nomeResumido: string | null 
}

/** Representa comissões e outros órgãos legislativos da Câmara. */
export interface Orgao extends DadosBasicosOrgao {
    readonly dataInicio: string | null
    readonly dataInstalacao: string | null
    readonly dataFim: string | null
    readonly dataFimOriginal: string | null
    readonly casa: string
    readonly sala: string | null
    readonly urlWebsite: string | null
}

export interface OrgaoOpcoes extends Omit<EndpointOpcoes<OrdenarOrgaos>, 'idLegislatura'> {
    /** ID de um ou mais órgãos. */
    id?: number[]
    /** Uma ou mais siglas oficialmente usadas para designar órgãos da Câmara. */
    sigla?: string[]
    /** Códigos dos tipos de órgãos. */
    codTipoOrgao?: number[]
}

export interface OrgaoEventoOpcoes extends Omit<EndpointOpcoes<OrdenarOrgaosEventos>, 'idLegislatura'> {
    /** ID dos tipos de evento. */
    idTipoEvento?: number[]
}

export interface MembroDoOrgao extends DadosBasicosDeputado {
    readonly titulo: string
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}

export type OrgaoMembroOpcoes = Pick<EndpointOpcoes<never>, 'dataInicio' | 'dataFim'>;

export interface OrgaoVotacaoOpcoes extends Pick<EndpointOpcoes<OrdenarOrgaosVotacoes>, 'ordem' | 'ordenarPor'> {
    /**
     * ID de uma ou mais proposições. Se presente, listará as votações que tiveram as
     * proposições como objeto de votação ou que afetaram as proposições listadas.
     */
    idProposicao?: number[]
    /**
     * Data em formato `AAAA-MM-DD` para início do intervalo de tempo no qual tenham sido realizadas as votações a serem listadas.
     * 
     * Se usada sozinha, essa opção faz com que sejam retornadas votações ocorridas dessa data até o fim do mesmo ano.
     * Se usada com `dataFim`, as duas datas devem ser de um mesmo ano.
     * 
     * Caso um objeto `Date` seja fornecido, ele será convertido para o formato correto automaticamente.
     */
    dataInicio?: string | Date
    /**
     * Data em formato `AAAA-MM-DD` que define o fim do intervalo de tempo no qual tenham sido realizadas as votações a serem listadas.
     * 
     * Se usada sozinha, essa opção faz com que sejam retornadas todas as votações ocorridas desde 1º de janeiro do mesmo ano
     * até esta data. Se usada com `dataInicio`, é preciso que as duas datas sejam de um mesmo ano.
     * 
     * Caso um objeto `Date` seja fornecido, ele será convertido para o formato correto automaticamente.
     */
    dataFim?: string | Date
}

////// PARTIDOS
export type DadosDosPartidos =
    | DadosBasicosPartido
    | Partido
    | LideresDoPartido
    | MembroDoPartido

export interface PartidoOpcoes extends EndpointOpcoes<OrdenarPartidos> {
    /** Sigla de um ou mais partidos. */
    sigla?: string[]
}

export type PartidoMembrosOpcoes = EndpointOpcoes<OrdenarPartidosMembros>;

export type DadosBasicosPartido = {
    /** ID do partido. */
    readonly id: number
    /** Sigla do partido. */
    readonly sigla: string
    /** Nome completo do partido. */
    readonly nome: string
    readonly uri: PartidosURL
}

export interface Partido extends DadosBasicosPartido {
    readonly status: StatusDoPartido
    readonly numeroEleitoral: number | null
    readonly urlLogo: string;
    readonly urlWebSite: string | null
    readonly urlFacebook: string | null
}

type StatusDoPartido = {
    readonly data: string
    readonly idLegislatura: string
    readonly situacao: 'Ativo' | 'Inativo'
    readonly totalPosse: string
    readonly totalMembros: string
    readonly uriMembros: DeputadosURL
    readonly lider: LiderDoPartido
}

/** Dados básicos sobre o líder do partido. */
type LiderDoPartido = {
    readonly uri: DeputadosURL
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: PartidosURL
    readonly uf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string
}

export type MembroDoPartido = DadosBasicosDeputado;

export interface LideresDoPartido extends MembroDoPartido {
    readonly titulo: string
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}

////// PROPOSIÇÕES
export type DadosDasProposicoes =
    | DadosBasicosProposicao
    | Proposicao
    | ProposicaoRelacionada
    | AutorDaProposicao
    | TemaDaProposicao
    | TramitacaoDaProposicao
    | VotacaoDaProposicao

// Interfaces que dependem dessa:
// Votacao
export type DadosBasicosProposicao = {
    readonly id: number
    readonly uri: ProposicoesURL
    readonly siglaTipo: string
    readonly codTipo: number
    readonly numero: number
    readonly ano: number
    readonly ementa: string
}

/**
 * Por algum motivo, as chaves `codTipo`, `numero` e `ano` possuem tipo string
 * quando a proposição está como proposição relacionada.
 */
export interface ProposicaoRelacionada extends Omit<DadosBasicosProposicao, 'codTipo' | 'numero' | 'ano'> {
    readonly codTipo: string
    readonly numero: string
    readonly ano: string
}

export interface Proposicao extends DadosBasicosProposicao {
    readonly dataApresentacao: string
    readonly uriOrgaoNumerador: OrgaosURL | null
    readonly statusProposicao: StatusDaProposicao
    readonly uriAutores: ProposicoesURL
    readonly descricaoTipo: string
    readonly ementaDetalhada: string
    readonly keywords: string
    readonly uriPropPrincipal: string | null
    readonly uriPropAnterior: string | null
    readonly uriPropPosterior: string | null
    readonly urlInteiroTeor: string | null
    readonly urnFinal: string | null
    readonly texto: string | null
    readonly justificativa: string | null
}

export interface ProposicaoOpcoes extends Omit<EndpointOpcoes<OrdenarProposicoes>, 'idLegislatura'> {
    /** ID de uma ou mais proposições. */
    id?: number[]
    /** Sigla dos tipos das proposições. */
    siglaTipo?: string[]
    /** Números oficialmente atribuídos às proposições segundo o art. 137 do Regimento Interno. */
    numero?: number[]
    /** Anos de apresentação das proposições, no formato `AAAA`. */
    ano?: number[]
    /** ID dos deputados autores das proposições. */
    idDeputadoAutor?: number[]
    /** Nome, ou parte do nome, do deputado autor da proposição. */
    autor?: string
    /** Siglas dos partidos dos deputadores autores das proposições. */
    siglaPartidoAutor?: string[]
    /**
     * ID do partido do autor. É importante destacar que são mais precisos do que as siglas,
     * que podem ser usadas por partidos diferentes em épocas diferentes.
     */
    idPartidoAutor?: number
    /** Sigla das unidades federativas pelas quais os autores das proposições tenham sido eleitos. */
    siglaUfAutor?: UnidadeFederativa[]
    /** Palavras-chave sobre o tema ao qual a proposição se relaciona. */
    keywords?: string[]
    /** Indica se a busca deve trazer apenas proposições que já tenham tramitado no Senado. */
    tramitacaoSenado?: boolean
    /**
     * Data do início do intervalo de tempo em que tenham sido apresentadas
     * as proposições a serem listadas, no formato `AAAA-MM-DD`.
     * 
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    dataApresentacaoInicio?: string | Date
    /**
     * Data do fim do intervalo de tempo em que tenham sido apresentadas
     * as proposições a serem listadas, no formato `AAAA-MM-DD`.
     * 
     * Se um objeto `Date` for fornecido, ele será convertido para o formato correto automaticamente.
     */
    dataApresentacaoFim?: string | Date
    /**
     * Códigos numéricos do tipo de situação em que se encontram as proposições que serão listadas.
     * 
     * Atenção: esta opção pode apresentar resultados inesperados, por problemas com o registro dos dados.
     */
    codSituacao?: number[]
    /** Códigos numéricos das áreas temáticas das proposições que serão listadas. */
    codTema?: number[]
}

export type ProposicaoTramitacaoOpcoes = Pick<EndpointOpcoes<never>, 'dataInicio' | 'dataFim'>;
export type ProposicaoVotacaoOpcoes = Pick<EndpointOpcoes<OrdenarProposicoesVotacao>, 'ordem' | 'ordenarPor'>;

// Quando a representação das tramitações adotada pela API mudar, é aconselhável revisar completamente esse tipo.
type StatusDaProposicao = {
    readonly dataHora: string
    readonly sequencia: number
    readonly siglaOrgao: string
    readonly uriOrgao: OrgaosURL
    readonly uriUltimoRelator: DeputadosURL | null
    readonly regime: string
    readonly descricaoTramitacao: string
    readonly codTipoTramitacao: string
    readonly descricaoSituacao: string | null
    readonly codSituacao: number | null
    readonly despacho: string
    readonly url: string | null
    readonly ambito: string
}

export type AutorDaProposicao = {
    readonly uri: DeputadosURL | OrgaosURL | null
    readonly nome: string
    readonly codTipo: number
    readonly tipo: string
    readonly ordemAssinatura: number
    readonly proponente: number
}

export type TemaDaProposicao = {
    readonly codTema: number
    readonly tema: string
    readonly relevancia: number
}

export type TramitacaoDaProposicao = StatusDaProposicao;
export type VotacaoDaProposicao = DadosBasicosVotacao;

////// VOTAÇÕES
export type DadosDasVotacoes =
    | DadosBasicosVotacao
    | Votacao
    | OrientacoesDaVotacao
    | Votos

/**
 * Usado diretamente nos métodos:
 * `Eventos.obterVotacoes()`,
 * `Proposicoes.obterVotacoes()` e
 * `Orgaos.obterVotacoes()`.
 */
export type DadosBasicosVotacao = {
    readonly id: string
    readonly uri: VotacoesURL
    readonly data: string
    readonly dataHoraRegistro: string
    readonly siglaOrgao: string
    readonly uriOrgao: OrgaosURL
    readonly uriEvento: EventosURL | null
    readonly proposicaoObjeto: string | null
    readonly uriProposicaoObjeto: ProposicoesURL | null
    readonly descricao: string
    readonly aprovacao: number
}

export interface VotacaoOpcoes extends Omit<EndpointOpcoes<OrdenarVotacoes>, 'idLegislatura'> {
    /** ID alfanumérico da votação. */
    id?: string[]
    /** 
     * ID de uma ou mais proposições. Se presente, listará as votações que tiveram
     * as proposições como objeto de votação ou que afetaram as proposições listadas.
     */
    idProposicao?: number[]
    /**
     * ID de um ou mais eventos realizados na Câmara, nos quais tenham sido realizadas as votações a serem listadas.
     * 
     * Somente os eventos deliberativos podem ter votações. Os eventos podem ter ocorrido
     * fora do intervalo de tempo padrão ou definido por `dataInicio` e/ou `dataFim`.
     */
    idEvento?: number[]
    /** ID de um ou mais órgãos. Se presente, serão retornadas somente votações dos órgãos enumerados. */
    idOrgao?: number[]
}

export interface Votacao extends DadosBasicosVotacao {
    readonly idOrgao: number
    readonly idEvento: number | null
    readonly descUltimaAberturaVotacao: string | null
    readonly dataHoraUltimaAberturaVotacao: string | null
    readonly ultimaApresentacaoProposicao: ApresentacaoProposicao
    readonly efeitosRegistrados: EfeitoRegistrado[]
    readonly objetosPossiveis: DadosBasicosProposicao[]
    readonly proposicoesAfetadas: DadosBasicosProposicao[]
}

type ApresentacaoProposicao = {
    readonly dataHoraRegistro: string | null
    readonly descricao: string | null
    readonly uriProposicaoCitada: ProposicoesURL | null
}

type EfeitoRegistrado = {
    readonly uriProposicao: ProposicoesURL
    readonly tituloProposicao: string
    readonly descResultado: string
    readonly dataHoraResultado: string
    readonly descUltimaAberturaVotacao: string | null
    readonly dataHoraUltimaAberturaVotacao: string | null
    readonly descUltimaApresentacaoProposicao: string | null
    readonly dataHoraUltimaApresentacaoProposicao: string | null
    readonly uriProposicaoCitada: ProposicoesURL | null
    readonly tituloProposicaoCitada: string | null
}

export type OrientacoesDaVotacao = {
    readonly orientacaoVoto: string
    readonly codTipoLideranca: string
    readonly siglaPartidoBloco: string
    readonly codPartidoBloco: number | null
    readonly uriPartidoBloco: PartidosURL | null
}

export type Votos = {
    readonly dataRegistroVoto: string
    readonly tipoVoto: string
    readonly deputado_: DadosBasicosDeputado
}