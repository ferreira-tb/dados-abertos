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

interface EndpointOpcoes {
    /** Data de início de um intervalo de tempo, no formato `AAAA-MM-DD`. */
    dataInicio?: string
    /** Data de término de um intervalo de tempo, no formato `AAAA-MM-DD`. */
    dataFim?: string
    /** O sentido da ordenação: `asc` para A a Z ou 0 a 9, e `desc` para Z a A ou 9 a 0. */
    ordem?: 'asc' | 'desc'
    /** Nome do campo pelo qual a lista deve ser ordenada: `id`, `sigla`, `nome`, `dataInicio` ou `dataFim`. */
    ordenarPor?: 'id'| 'sigla' | 'nome' | 'dataInicio' | 'dataFim'
}

////// LINKS
type CamaraEndpoints =
    | DeputadoEndpointURL
    | PartidoEndpointURL

type DeputadoEndpointURL = `https://dadosabertos.camara.leg.br/api/${VersaoAPI}/deputados${string}`;
type PartidoEndpointURL = `https://dadosabertos.camara.leg.br/api/${VersaoAPI}/partidos${string}`;

////// PARTIDOS
type DadosDosPartidos =
    | DadosBasicosPartido
    | Partido
    | LideresDoPartido

interface PartidoEndpointOpcoes extends EndpointOpcoes {
    /** Sigla de um ou mais partidos. */
    sigla?: string[]
    /** Número das legislaturas às quais os dados buscados devem corresponder. */
    idLegislatura?: number[]
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
    readonly email: string
    readonly urlFoto: string
    readonly titulo: 'Líder' | '1º Vice-Líder' | 'Vice-Líder'
    readonly codTitulo: number
    readonly dataInicio: string
    readonly dataFim: string | null
}