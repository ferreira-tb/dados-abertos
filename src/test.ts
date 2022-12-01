import * as fs from 'node:fs/promises';
import { Proposicoes } from './endpoints/proposicoes.js';

const proposicoes = new Proposicoes();
fs.writeFile('test.json', JSON.stringify(await proposicoes.obterVotacoes(2339806)));