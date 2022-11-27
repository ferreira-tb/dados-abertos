////// GLOBAL
type VersaoAPI = 'v2';
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

interface CamaraEndpoint<D, L> {
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
/** ID, nome e sigla da unidade federativa. */
type OrdenarIDNomeSUF = 'id' | 'nome' | 'siglaUf';
/** ID, nome, sigla, data inicial e data final. */
type OrdenarIDNomeSiglaData = OrdenarIDNome | 'sigla' | 'dataInicio' | 'dataFim';

////// LINKS
type CamaraEndpoints =
    | DeputadoEndpointURL
    | PartidoEndpointURL

type EndpointURL = `https://dadosabertos.camara.leg.br/api/${VersaoAPI}`;
type DeputadoEndpointURL = `${EndpointURL}/deputados${string}`;
type PartidoEndpointURL = `${EndpointURL}/partidos${string}`;

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
    readonly uri: PartidoEndpointURL
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
    uriMembros: DeputadoEndpointURL
    lider: LiderDoPartido
}

/** Dados básicos sobre o líder do partido. */
interface LiderDoPartido {
    uri: DeputadoEndpointURL
    nome: string
    siglaPartido: string
    uriPartido: PartidoEndpointURL
    uf: UnidadeFederativa
    idLegislatura: number
    urlFoto: string
}

interface LideresDoPartido {
    readonly id: number
    readonly uri: string
    readonly idLegislatura: number
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: string
    readonly siglaUf: UnidadeFederativa
    readonly email: string | null
    readonly urlFoto: string
    readonly titulo: 'Líder' | '1º Vice-Líder' | 'Vice-Líder'
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}

interface MembrosDoPartido {
    readonly id: number
    readonly uri: string
    readonly nome: string
    readonly siglaPartido: string
    readonly uriPartido: string
    readonly siglaUf: UnidadeFederativa
    readonly idLegislatura: number
    readonly urlFoto: string
    readonly email: string | null
}