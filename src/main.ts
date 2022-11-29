import * as fs from 'node:fs/promises';
import Legislaturas from './endpoints/legislaturas.js';

const legislaturas = new Legislaturas();
fs.writeFile('test.json', JSON.stringify(await legislaturas.obterMesa(55)));