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

interface ResultadoBusca<D, L> {
    dados: D
    links: NavegacaoEntrePaginas<L>[]
}

interface NavegacaoEntrePaginas<L> {
    /** Relação com a página atual. */
    readonly rel: 'first' | 'last' | 'next' | 'self'
    /** Link para a nova página. */
    readonly href: L
}

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

/** ID e nome. */
type OrdenarIDNome = 'id' | 'nome';
/** Data inicial e data final. */
type OrdenarData = 'dataInicio' | 'dataFim';
/** ID, nome e legislatura. */
type OrdenarIDNomeLeg = OrdenarIDNome | 'idLegislatura';
/** ID, nome e sigla da unidade federativa. */
type OrdenarIDNomeSUF = 'id' | 'nome' | 'siglaUf';
/** ID, nome, sigla, data inicial e data final. */
type OrdenarIDNomeSiglaData = OrdenarIDNome | OrdenarData | 'sigla';

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

type Endpoints =
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
type TodosEndpointsURL = `${EndpointURLBase}/${Endpoints}`;

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

////// BLOCOS
type DadosDosBlocos =
    | DadosBasicosBloco

interface BlocoEndpointOpcoes extends Omit<EndpointOpcoes<OrdenarIDNomeLeg>, 'dataInicio' | 'dataFim'> {
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

////// PARTIDOS
type DadosDosPartidos =
    | DadosBasicosPartido
    | Partido
    | LideresDoPartido
    | MembrosDoPartido

interface PartidoEndpointOpcoes extends EndpointOpcoes<OrdenarIDNomeSiglaData> {
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
    data: string
    idLegislatura: string
    situacao: 'Ativo' | 'Inativo'
    totalPosse: string
    totalMembros: string
    uriMembros: DeputadosEndpointURL
    lider: LiderDoPartido
}

/** Dados básicos sobre o líder do partido. */
interface LiderDoPartido {
    uri: DeputadosEndpointURL
    nome: string
    siglaPartido: string
    uriPartido: PartidosEndpointURL
    uf: UnidadeFederativa
    idLegislatura: number
    urlFoto: string
}

interface MembrosDoPartido {
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

interface LideresDoPartido extends MembrosDoPartido {
    readonly titulo: 'Líder' | '1º Vice-Líder' | 'Vice-Líder'
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}