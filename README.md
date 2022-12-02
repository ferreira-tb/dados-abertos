# Dados Abertos - Câmara dos Deputados
Interface simples e tipada para a REST API Dados Abertos da [Câmara dos Deputados do Brasil](https://www.camara.leg.br/).

O objetivo dessa biblioteca é servir como uma ponte entre o serviço Dados Abertos da Câmara dos Deputados e o desenvolvedor, facilitando a criação de aplicações derivadas.

## Instalação

```
$ npm i dados-abertos
```

## Como usar

Escolha os temas sobre o quais quer obter informações e importe-os.

```javascript
import { Deputados, Votacoes } from 'dados-abertos';

// Lista com todos os deputados.
const listaDeputados = await Deputados.obterTodos();
// Detalhes sobre um deputado específico.
const joao = await Deputados.obterUm(123456);
// Despesas do deputado.
const despesas = await Deputados.obterDespesas(123456);

// Votações recentes.
const votacoesRecentes = await Votacoes.obterTodas();
// Detalhes sobre uma votação.
const aquelaVotacao = await Votacoes.obterUma('1234567-89');
// Como cada deputado votou.
const votos = await Votacoes.obterVotos('1234567-89');

// E muito mais!
```

## Documentação

Para entender como utilizar cada um, consulte a [wiki](https://github.com/ferreira-tb/node-dados-abertos/wiki) do repositório.

- [`BlocosPartidarios`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Blocos-Partid%C3%A1rios)
- [`Deputados`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Deputados)
- [`Eventos`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Eventos)
- [`FrentesParlamentares`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Frentes-Parlamentares)
- [`Legislaturas`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Legislaturas)
- [`Orgaos`](https://github.com/ferreira-tb/node-dados-abertos/wiki/%C3%93rg%C3%A3os)
- [`Partidos`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Partidos)
- [`Proposicoes`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Proposi%C3%A7%C3%B5es)
- [`Votacoes`](https://github.com/ferreira-tb/node-dados-abertos/wiki/Vota%C3%A7%C3%B5es)