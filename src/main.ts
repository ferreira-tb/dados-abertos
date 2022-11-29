import * as fs from 'node:fs/promises';
import FrentesParlamentares from './endpoints/frentes.js';

const frentes = new FrentesParlamentares();
fs.writeFile('test.json', JSON.stringify(await frentes.obterTodas()));