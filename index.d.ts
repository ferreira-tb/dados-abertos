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

type LinksNavegacao<L> = ReadonlyArray<NavegacaoEntrePaginas<L>>;

type ResultadoBusca<D, L> = {
    readonly dados: D
    readonly links: LinksNavegacao<L>
}

type NavegacaoEntrePaginas<L> = {
    /** Relação com a página atual. */
    readonly rel: 'first' | 'last' | 'next' | 'self'
    /** Link para a nova página. */
    readonly href: L
}

type Bancada = {
    readonly tipo: string
    readonly nome: string
    readonly uri: PartidosURL | null
}

////// DADOS
type TodosDados = 
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
// Básicos.
/** ID e nome. */
type OrdenarIDN = 'id' | 'nome';
/** Data inicial e data final. */
type OrdenarData = 'dataInicio' | 'dataFim';

// Por endpoint.
/** ID, nome e legislatura. */
type OrdenarBlocos = OrdenarIDN | 'idLegislatura';
/** ID, nome, legislatura, sigla da unidade federativa e sigla do partido. */
type OrdenarDeputados = OrdenarIDN | 'idLegislatura' | 'siglaUf' | 'siglaPartido';
/** Legislatura ou qualquer chave do objeto. */
type OrdenarDeputadosDespesas = keyof DespesasDoDeputado | 'idLegislatura';
/** Data e hora iniciais. */
type OrdenarDeputadosDiscursos = 'dataHoraInicio';
/** ID, data e hora iniciais e a sigla do órgão. */
type OrdenarDeputadosEventos = 'id' | 'dataHoraInicio' | 'siglaOrgao';
/** ID, sigla e nome do orgão, além do título e as datas de início e fim. */
type OrdenarDeputadosOrgaos = OrdenarData | 'idOrgao' | 'siglaOrgao' | 'nomeOrgao' | 'titulo';
/** ID, data e hora, descrição e título. */
type OrdenarEventos = 'id' | 'dataHoraInicio' | 'dataHoraFim' | 'descricaoSituacao' | 'descricaoTipo' | 'titulo';
/** Não há ordenação para as frentes parlamentares. */
type OrdenarFrentes = never;
/** ID da legislatura. */
type OrdenarLegislaturas = 'id';
/** ID, nome, sigla, data inicial e data final. */
type OrdenarPartidos = OrdenarIDN | OrdenarData | 'sigla';
/** ID, nome e sigla da unidade federativa. */
type OrdenarPartidosMembros = OrdenarIDN | 'siglaUf';

// União dos tipos usados por diferentes partes de um mesmo endpoint.
// Os tipos resultantes então são usados como constraint em alguns métodos.
type BlocosOrdenarPor = OrdenarBlocos;
type DeputadosOrdenarPor =
    | OrdenarDeputados
    | OrdenarDeputadosDespesas
    | OrdenarDeputadosDiscursos
    | OrdenarDeputadosEventos
    | OrdenarDeputadosOrgaos;

type EventosOrdenarPor = OrdenarEventos;
type FrentesOrdenarPor = OrdenarFrentes;
type LegislaturasOrdenarPor = OrdenarLegislaturas;
type OrgaosOrdenarPor = '';
type PartidosOrdenarPor = OrdenarPartidos | OrdenarPartidosMembros;
type ProposicoesOrdenarPor = '';
type ReferenciasOrdenarPor = '';
type VotacoesOrdenarPor = '';

////// ENDPOINTS
type CamaraEndpoints =
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

type NomesDosEndpoints =
    | 'blocos'
    | 'deputados'
    | 'eventos'
    | 'frentes'
    | 'legislaturas'
    | 'orgaos'
    | 'partidos'
    | 'proposicoes'
    | 'referencias'
    | 'votacoes'

type VersaoAPI = 'v2';
type EndpointURLBase = `https://dadosabertos.camara.leg.br/api/${VersaoAPI}`;
type TodosEndpointsURL = `${EndpointURLBase}/${NomesDosEndpoints}`;

type BlocosURL = `${EndpointURLBase}/blocos${string}`;
type DeputadosURL = `${EndpointURLBase}/deputados${string}`;
type EventosURL = `${EndpointURLBase}/eventos${string}`;
type FrentesURL = `${EndpointURLBase}/frentes${string}`;
type LegislaturasURL = `${EndpointURLBase}/legislaturas${string}`;
type OrgaosURL = `${EndpointURLBase}/orgaos${string}`;
type PartidosURL = `${EndpointURLBase}/partidos${string}`;
type ProposicoesURL = `${EndpointURLBase}/proposicoes${string}`;
type ReferenciasURL = `${EndpointURLBase}/referencias${string}`;
type VotacoesURL = `${EndpointURLBase}/votacoes${string}`;

////// OPÇÕES
type EndpointOpcoes<O> = {
    /** Data de início de um intervalo de tempo, no formato `AAAA-MM-DD`. */
    dataInicio?: string
    /** Data de término de um intervalo de tempo, no formato `AAAA-MM-DD`. */
    dataFim?: string
    /** Número das legislaturas às quais os dados buscados devem corresponder. */
    idLegislatura?: number[]
    /** O sentido da ordenação: `asc` para A a Z ou 0 a 9, e `desc` para Z a A ou 9 a 0. */
    ordem?: 'asc' | 'desc'
    /** Nome do campo pelo qual a lista deve ser ordenada: `id`, `sigla`, `nome`, `dataInicio` ou `dataFim`. */
    ordenarPor?: O
}

type BlocosTodasOpcoes = keyof BlocoOpcoes;
type DeputadosTodasOpcoes = 
    | keyof DeputadoOpcoes
    | keyof DeputadoDespesasOpcoes
    | keyof DeputadoDiscursosOpcoes;

type EventosTodasOpcoes = keyof EventoOpcoes;
type FrentesTodasOpcoes = keyof FrenteOpcoes;
type LegislaturasTodasOpcoes = keyof LegislaturaOpcoes | keyof LegislaturaMesaOpcoes;
type OrgaosTodasOpcoes = never;
type PartidosTodasOpcoes = keyof PartidoOpcoes;
type ProposicoesTodasOpcoes = never;
type ReferenciasTodasOpcoes = never;
type VotacoesTodasOpcoes = never;

////// BLOCOS
type DadosDosBlocos =
    | DadosBasicosBloco

interface BlocoOpcoes extends Omit<EndpointOpcoes<OrdenarBlocos>, 'dataInicio' | 'dataFim'> {
    /** ID de um ou mais blocos partidários. */
    id?: number[]
}

type DadosBasicosBloco = {
    /** ID do bloco partidário. */
    readonly id: string
    /** Siglas dos partidos associados. */
    readonly nome: string
    /** ID da legislatura. */
    readonly idLegislatura: string
    readonly uri: BlocosURL
}

////// DEPUTADOS
type DadosDosDeputados =
    | DadosBasicosDeputado
    | Deputado
    | DespesasDoDeputado
    | DiscursosDoDeputado
    | EventosDoDeputado
    | FrentesDoDeputado
    | OcupacoesDoDeputado
    | OrgaosDoDeputado
    | ProfissoesDoDeputado

interface DeputadoOpcoes extends EndpointOpcoes<OrdenarDeputados> {
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
interface DeputadoDespesasOpcoes extends Omit<EndpointOpcoes<OrdenarDeputadosDespesas>, 'dataInicio' | 'dataFim'> {
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

type DeputadoDiscursosOpcoes = EndpointOpcoes<OrdenarDeputadosDiscursos>;
type DeputadoEventosOpcoes = Omit<EndpointOpcoes<OrdenarDeputadosEventos>, 'idLegislatura'>;
type DeputadoOrgaosOpcoes = Omit<EndpointOpcoes<OrdenarDeputadosOrgaos>, 'idLegislatura'>;

// Interfaces que dependem dessa:
// CoordenadorDaFrente, DeputadosNoEvento, LideresDaLegislatura,
// MembrosDoPartido, MesaDaLegislatura, PautaDoEvento, StatusDoDeputado.
type DadosBasicosDeputado = {
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
type Deputado = {
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
type DespesasDoDeputado = {
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
type DiscursosDoDeputado = {
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
type EventosDoDeputado = {
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
type FrentesDoDeputado = DadosBasicosFrente;

/** Os empregos e atividades que o deputado já teve. */
type OcupacoesDoDeputado = {
    readonly anoFim: number | null
    readonly anoInicio: number | null
    readonly entidade: string | null
    readonly entidadePais: string | null
    readonly entidadeUF: string | null
    readonly titulo: string
}

/** Os órgãos dos quais um deputado é integrante. */
type OrgaosDoDeputado = {
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
type ProfissoesDoDeputado = {
    readonly dataHora: string
    readonly codTipoProfissao: number
    readonly titulo: string
}

////// EVENTOS
type DadosDosEventos =
    | DadosBasicosEvento
    | Evento
    | DeputadosNoEvento
    | OrgaosDoEvento
    | PautaDoEvento
    | DadosBasicosVotacao

type DadosBasicosEvento = {
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
interface Evento extends DadosBasicosEvento {
    readonly uriDeputados: null
    readonly uriConvidados: null
    readonly fases: null
    readonly requerimentos: ReadonlyArray<Requerimento>
    readonly urlDocumentoPauta: EventosURL
}

interface EventoOpcoes extends Omit<EndpointOpcoes<OrdenarEventos>, 'idLegislatura'> {
    /** ID de um ou mais eventos. */
    id?: number[]
    /** ID dos tipos de evento que se deseja obter. */
    codTipoEvento?: number[]
    /** ID de tipos de situação de evento. */
    codSituacao?: number[]
    /** ID de tipos de órgãos realizadores dos eventos que se deseja obter. */
    codTipoOrgao?: number[]
    /** ID dos órgãos. */
    idOrgao?: number[]
    /** Hora inicial, no formato `HH:MM`. */
    horaInicio?: string
    /** Hora de término, no formato `HH:MM`. */
    horaFim?: string
}

/** Deputados participantes de um evento específico. */
type DeputadosNoEvento = ReadonlyArray<DadosBasicosDeputado>;
/** Órgãos organizadores do evento. */
type OrgaosDoEvento = ReadonlyArray<DadosBasicosOrgao>;

type PautaDoEvento = {
    readonly ordem: number
    readonly topico: string
    readonly regime: string
    readonly codRegime: number
    readonly titulo: string
    readonly proposicao_: Proposicao_
    readonly relator: DadosBasicosDeputado
    readonly textoParecer: string | null
    readonly proposicaoRelacionada_: Proposicao_
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
type DadosDasFrentes =
    | DadosBasicosFrente
    | Frente
    | MembroDaFrente

type DadosBasicosFrente = {
    readonly id: number
    readonly uri: FrentesURL
    readonly titulo: string
    readonly idLegislatura: number
}

interface Frente extends DadosBasicosFrente {
    readonly telefone: string
    readonly email: string | null
    readonly keywords: string | null
    readonly idSituacao: null
    readonly situacao: string
    readonly urlWebsite: string | null
    readonly urlDocumento: string | null
    readonly coordenador: CoordenadorDaFrente
}

type CoordenadorDaFrente = {
    [key in keyof DadosBasicosDeputado]: DadosBasicosDeputado[key] | null;
}

interface FrenteOpcoes extends Pick<EndpointOpcoes<OrdenarFrentes>, 'idLegislatura'> { }

type TipoBaseMembroDaFrente = {
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
type MembroDaFrente = {
    [key in keyof TipoBaseMembroDaFrente]: TipoBaseMembroDaFrente[key] | null;
}

////// LEGISLATURAS
type DadosDasLegislaturas =
    | DadosBasicosLegislatura
    | Legislatura
    | LideresDaLegislatura
    | MesaDaLegislatura

type DadosBasicosLegislatura = {
    readonly id: number
    readonly uri: LegislaturasURL
    readonly dataInicio: string
    readonly dataFim: string
}

type Legislatura = DadosBasicosLegislatura;

interface LegislaturaOpcoes extends Pick<EndpointOpcoes<OrdenarLegislaturas>, 'ordem' | 'ordenarPor'> {
    /**
     * Data no formato `AAAA-MM-DD`. Se este parâmetro estiver presente,
     * a requisição retornará as informações básicas sobre a legislatura em curso na data fornecida.
     */
    data?: string;
    /** ID de uma ou mais legislaturas. */
    id?: number[]
}

type LegislaturaMesaOpcoes = Pick<EndpointOpcoes<never>, 'dataInicio' | 'dataFim'>;

/** Líderes, vice-líderes e representantes na legislatura. */
type LideresDaLegislatura = {
    readonly parlamentar: DadosBasicosDeputado
    readonly titulo: string
    readonly dataInicio: string
    readonly dataFim: string
}

interface MesaDaLegislatura extends DadosBasicosDeputado {
    readonly dataInicio: string
    readonly dataFim: string
    readonly titulo: string
    readonly codTitulo: string
}

////// ORGÃOS
type DadosDosOrgaos =
    | DadosBasicosOrgao
    | Orgao

// Interfaces que dependem dessa:
// DadosBasicosEvento, EventosDoDeputado, OrgaosDoEvento.
type DadosBasicosOrgao = {
    readonly id: number
    readonly uri: OrgaosURL
    readonly sigla: string
    readonly nome: string
    readonly apelido: string
    readonly codTipoOrgao: number
    readonly tipoOrgao: string
    readonly nomePublicacao: string
    readonly nomeResumido: string | null 
}

/** Representa comissões e outros órgãos legislativos da Câmara. */
interface Orgao extends DadosBasicosOrgao {
    readonly dataInicio: string | null
    readonly dataInstalacao: string | null
    readonly dataFim: string | null
    readonly dataFimOriginal: string | null
    readonly casa: string
    readonly sala: string | null
    readonly urlWebsite: string | null
}

////// PARTIDOS
type DadosDosPartidos =
    | DadosBasicosPartido
    | Partido
    | LideresDoPartido
    | MembrosDoPartido

interface PartidoOpcoes extends EndpointOpcoes<OrdenarPartidos> {
    /** Sigla de um ou mais partidos. */
    sigla?: string[]
}

type PartidoMembrosOpcoes = EndpointOpcoes<OrdenarPartidosMembros>;

type DadosBasicosPartido = {
    /** ID do partido. */
    readonly id: number
    /** Sigla do partido. */
    readonly sigla: string
    /** Nome completo do partido. */
    readonly nome: string
    readonly uri: PartidosURL
}

interface Partido extends DadosBasicosPartido {
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

type MembrosDoPartido = DadosBasicosDeputado;

interface LideresDoPartido extends MembrosDoPartido {
    readonly titulo: string
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}

////// PROPOSIÇÕES
type DadosDasProposicoes = never;
/**
 * No endpoint `/eventos/{id}/pauta`, o tipos de `codTipo`, `numero` e `ano` aparecem como números em `proposicao_`.
 * Contudo, aparecem como `string` em `proposicaoRelacionada_`, no mesmo endpoint.
 */
type Proposicao_ = {
    readonly id: number
    readonly uri: ProposicoesURL
    readonly siglaTipo: string
    readonly codTipo: number | string
    readonly numero: number | string
    readonly ano: number | string
    readonly ementa: string
}

////// VOTAÇÕES
type DadosDasVotacoes =
    | DadosBasicosVotacao

/** Usado diretamente no método `Eventos.prototype.obterVotacoes()`. */
type DadosBasicosVotacao = {
    readonly id: string
    readonly uri: string
    readonly data: string
    readonly dataHoraRegistro: string
    readonly siglaOrgao: string
    readonly uriOrgao: OrgaosURL
    readonly uriEvento: EventosURL
    readonly proposicaoObjeto: string | null
    readonly uriProposicaoObjeto: string | null
    readonly descricao: string
    readonly aprovacao: number
}