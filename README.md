# Dados Abertos - Câmara dos Deputados
Interface simples e tipada para a REST API Dados Abertos da [Câmara dos Deputados do Brasil](https://www.camara.leg.br/).

O objetivo dessa biblioteca é servir como uma ponte entre o serviço Dados Abertos da Câmara dos Deputados e o desenvolvedor, facilitando a criação de aplicações derivadas.

## Instalação

```
$ npm i dados-abertos
```

**Observação:** Essa ferramenta depende da função global [fetch](https://nodejs.org/dist/latest-v16.x/docs/api/globals.html#fetch) do Node.js.
Portanto, recomenda-se usar a versão 19.1.0 ou mais recente.

## Como usar

Escolha os temas sobre o quais quer obter informações e importe-os.

```javascript
import { Deputados, Votacoes } from 'dados-abertos';

const deputados = new Deputados();

// Lista com todos os deputados.
const listaDeputados = await deputados.obterTodos();
// Detalhes sobre um deputado específico.
const joao = await deputados.obterUm(123456);
// Despesas do deputado.
const despesas = await deputados.obterDespesas(123456);

const votacoes = new Votacoes();

// Votações recentes.
const votacoesRecentes = await votacoes.obterTodas();
// Detalhes sobre uma votação.
const aquelaVotacao = await votacoes.obterUma('1234567-89');
// Como cada deputado votou.
const votos = await votacoes.obterVotos('1234567-89');

// E muito mais!
```

## Temas disponíveis

- `BlocosPartidarios`
- `Deputados`
- `Eventos`
- `FrentesParlamentares`
- `Legislaturas`
- `Orgaos`
- `Partidos`
- `Proposicoes`
- `Votacoes`