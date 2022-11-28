import * as fs from 'node:fs/promises';
import Deputados from './endpoints/deputados.js';

const deputados = new Deputados();
fs.writeFile('test.json', JSON.stringify(await deputados.obterTodos({ idLegislatura: [55], ordem: 'desc', ordenarPor: 'nome' })));