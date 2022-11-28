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

type LinksNavegacao<L> = ReadonlyArray<NavegacaoEntrePaginas<L>>
interface ResultadoBusca<D, L> {
    dados: D
    links: LinksNavegacao<L>
}

interface NavegacaoEntrePaginas<L> {
    /** Relação com a página atual. */
    readonly rel: 'first' | 'last' | 'next' | 'self'
    /** Link para a nova página. */
    readonly href: L
}

interface Bancada {
    readonly tipo: string
    readonly nome: string
    readonly uri: PartidosEndpointURL | null
}

/** 
 * Array contendo as chaves cujo valor devem ser strings.
 * É usada nas funções que constroem as URLs.
 */
type StringKeys<T> = ReadonlyArray<T>; 

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
/** ID, nome, sigla, data inicial e data final. */
type OrdenarPartidos = OrdenarIDN | OrdenarData | 'sigla';
/** ID, nome e sigla da unidade federativa. */
type OrdenarPartidosMembros = OrdenarIDN | 'siglaUf';

// União dos tipos usados por diferentes partes de um mesmo endpoint.
// Os tipos resultantes então são usados como constraint em funções.
type BlocosOrdenarPor = OrdenarBlocos;
type DeputadosOrdenarPor = OrdenarDeputados;
type EventosOrdenarPor = '';
type FrentesOrdenarPor = '';
type LegislaturasOrdenarPor = '';
type OrgaosOrdenarPor = '';
type PartidosOrdenarPor = OrdenarPartidos | OrdenarPartidosMembros;
type ProposicoesOrdenarPor = '';
type ReferenciasOrdenarPor = '';
type VotacoesOrdenarPor = '';

////// ENDPOINTS
type CamaraEndpoints =
    | BlocosEndpointURL
    | DeputadosEndpointURL
    | EventosEndpointURL
    | FrentesEndpointURL
    | LegislaturasEndpointURL
    | OrgaosEndpointURL
    | PartidosEndpointURL
    | ProposicoesEndpointURL
    | ReferenciasEndpointURL
    | VotacoesEndpointURL

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

type BlocosEndpointURL = `${EndpointURLBase}/blocos${string}`;
type DeputadosEndpointURL = `${EndpointURLBase}/deputados${string}`;
type EventosEndpointURL = `${EndpointURLBase}/eventos${string}`;
type FrentesEndpointURL = `${EndpointURLBase}/frentes${string}`;
type LegislaturasEndpointURL = `${EndpointURLBase}/legislaturas${string}`;
type OrgaosEndpointURL = `${EndpointURLBase}/orgaos${string}`;
type PartidosEndpointURL = `${EndpointURLBase}/partidos${string}`;
type ProposicoesEndpointURL = `${EndpointURLBase}/proposicoes${string}`;
type ReferenciasEndpointURL = `${EndpointURLBase}/referencias${string}`;
type VotacoesEndpointURL = `${EndpointURLBase}/votacoes${string}`;

////// OPÇÕES
interface EndpointOpcoes<O> {
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

////// BLOCOS
type DadosDosBlocos =
    | DadosBasicosBloco

interface BlocoEndpointOpcoes extends Omit<EndpointOpcoes<OrdenarBlocos>, 'dataInicio' | 'dataFim'> {
    /** ID de um ou mais blocos partidários. */
    id?: number[]
}

interface DadosBasicosBloco {
    /** ID do bloco partidário. */
    readonly id: string
    /** Siglas dos partidos associados. */
    readonly nome: string
    /** ID da legislatura. */
    readonly idLegislatura: string
    readonly uri: BlocosEndpointURL
}

////// DEPUTADOS
type DadosDosDeputados =
    | DadosBasicosDeputado
    | Deputado

interface DeputadoEndpointOpcoes extends EndpointOpcoes<OrdenarDeputados> {
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

// Interfaces que dependem dessa:
// CoordenadorDaFrente, DeputadosNoEvento, LideresDaLegislatura, MembrosDoPartido, StatusDoDeputado.
interface DadosBasicosDeputado {
    readonly id: number
    readonly uri: DeputadosEndpointURL
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: PartidosEndpointURL
    readonly siglaUf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string
    readonly email: string | null
}

/** 
 * Informações detalhadas sobre um deputado específico.
 * 
 * Essa interface é apenas um rascunho, pois não foi possível obter dados da API da câmara.
 * É preciso verificar item por item após os dados estarem disponíveis,
 * pois é muito provável que alguns tipos estejam incorretos.
 */
interface Deputado {
    readonly cpf: string
    readonly dataFalecimento: string
    readonly dataNascimento: string
    readonly escolaridade: string
    readonly id: number
    readonly municipioNascimento: string
    readonly nomeCivil: string
    readonly redeSocial: ReadonlyArray<string>
    readonly sexo: 'F' | 'M'
    readonly ufNascimento: UnidadeFederativa
    readonly ultimoStatus: StatusDoDeputado
    readonly uri: DeputadosEndpointURL
    readonly urlWebsite: string
}

interface StatusDoDeputado extends DadosBasicosDeputado {
    readonly condicaoEleitoral: string
    readonly data: string
    readonly descricaoStatus: string
    readonly gabinete: GabineteDoDeputado
    readonly nomeEleitoral: string
    readonly situacao: string
}

interface GabineteDoDeputado {
    readonly andar: string
    readonly email: string
    readonly nome: string
    readonly predio: string
    readonly sala: string
    readonly telefone: string
}

/** As despesas com exercício parlamentar do deputado. */
interface DespesasDoDeputado {
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
    readonly urlDocumento: string
    readonly valorDocumento: number
    readonly valorGlosa: number
    readonly valorLiquido: number
}

/** Discursos feitos por um deputado em eventos diversos. */
interface DiscursosDoDeputado {
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
interface EventosDoDeputado {
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
    readonly urlRegistro: string
}

/** As frentes parlamentares das quais um deputado é integrante. */
interface FrentesDoDeputado extends DadosBasicosFrente { }

/** Os empregos e atividades que o deputado já teve. */
interface OcupacoesDoDeputado {
    readonly anoFim: number
    readonly anoInicio: number
    readonly entidade: string
    readonly entidadePais: string
    readonly entidadeUF: string
    readonly titulo: string
}

/** Os órgãos dos quais um deputado é integrante. */
interface OrgaosDoDeputado {
    readonly codTitulo: string
    readonly dataFim: string
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
interface ProfissoesDoDeputado {
    readonly id: number
    readonly idLegislatura: number
    readonly titulo: string
    readonly uri: string
}

////// EVENTOS
interface DadosBasicosEvento {
    readonly id: number
    readonly uri: EventosEndpointURL
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

type Requerimento = {
    titulo: string;
    uri: ProposicoesEndpointURL
}

/** Representa eventos ocorridos ou previstos nos diversos órgãos da Câmara. */
interface Evento extends DadosBasicosEvento {
    readonly uriDeputados: null
    readonly uriConvidados: null
    readonly fases: null
    readonly requerimentos: ReadonlyArray<Requerimento>
    readonly urlDocumentoPauta: EventosEndpointURL
}

/** Deputados participantes de um evento específico. */
type DeputadosNoEvento = ReadonlyArray<DadosBasicosDeputado>;
/** Órgãos organizadores do evento. */
type OrgaosDoEvento = ReadonlyArray<DadosBasicosOrgao>;

interface LocalCamara {
    readonly andar: string | null
    readonly nome: string | null
    readonly predio: string | null
    readonly sala: string | null
}

interface FaseEvento {
    readonly dataHoraFim: string | null
    readonly dataHoraInicio: string | null
    readonly titulo: string
}

////// FRENTES
interface DadosBasicosFrente {
    readonly id: number
    readonly idLegislatura: number
    readonly titulo: string
    readonly uri: FrentesEndpointURL
}

interface Frente extends DadosBasicosFrente {
    readonly telefone: string
    readonly email: string
    readonly keywords: string | null
    readonly idSituacao: null
    readonly situacao: string
    readonly urlWebsite: string | null
    readonly urlDocumento: string
    readonly coordenador: CoordenadorDaFrente
}

interface CoordenadorDaFrente extends DadosBasicosDeputado { }

/** Representa um deputado que faz parte de uma frente parlamentar. */
interface MembroDaFrente {
    readonly id: number
    readonly uri: DeputadosEndpointURL
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: PartidosEndpointURL
    readonly siglaUf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string
    readonly email: string | null
    readonly titulo: string
    readonly codTitulo: number
    readonly dataInicio: string | null
    readonly dataFim: string | null
}

////// LEGISLATURAS
interface DadosBasicosLegislatura {
    readonly id: number
    readonly uri: LegislaturasEndpointURL
    readonly dataInicio: string
    readonly dataFim: string
}

interface Legislatura extends DadosBasicosLegislatura { }

/** Líderes, vice-líderes e representantes na legislatura. */
interface LideresDaLegislatura {
    readonly parlamentar: DadosBasicosDeputado
    readonly titulo: string
    readonly dataInicio: string
    readonly dataFim: string
}

interface MesaDaLegislatura {
    // ERRO 500
}

////// ORGÃOS
// Interfaces que dependem dessa:
// DadosBasicosEvento, EventosDoDeputado, OrgaosDoEvento.
interface DadosBasicosOrgao {
    readonly id: number
    readonly uri: OrgaosEndpointURL
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

interface PartidoEndpointOpcoes extends EndpointOpcoes<OrdenarPartidos> {
    /** Sigla de um ou mais partidos. */
    sigla?: string[]
}

interface DadosBasicosPartido {
    /** ID do partido. */
    readonly id: number
    /** Sigla do partido. */
    readonly sigla: string
    /** Nome completo do partido. */
    readonly nome: string
    readonly uri: PartidosEndpointURL
}

interface Partido extends DadosBasicosPartido {
    readonly status: StatusDoPartido
    readonly numeroEleitoral: number | null
    readonly urlLogo: string;
    readonly urlWebSite: string | null
    readonly urlFacebook: string | null
}

interface StatusDoPartido {
    readonly data: string
    readonly idLegislatura: string
    readonly situacao: 'Ativo' | 'Inativo'
    readonly totalPosse: string
    readonly totalMembros: string
    readonly uriMembros: DeputadosEndpointURL
    readonly lider: LiderDoPartido
}

/** Dados básicos sobre o líder do partido. */
interface LiderDoPartido {
    readonly uri: DeputadosEndpointURL
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: PartidosEndpointURL
    readonly uf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string
}

interface MembrosDoPartido extends DadosBasicosDeputado { }

interface LideresDoPartido extends MembrosDoPartido {
    readonly titulo: 'Líder' | '1º Vice-Líder' | 'Vice-Líder'
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}