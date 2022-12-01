import * as fs from 'node:fs/promises';
import Eventos from './endpoints/eventos.js';

const eventos = new Eventos();
fs.writeFile('test.json', JSON.stringify(await eventos.obterUm(66716)));