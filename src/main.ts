import * as fs from 'node:fs/promises';
import BlocosPartidarios from './endpoints/blocos.js';

const blocos = new BlocosPartidarios();
fs.writeFile('test.json', JSON.stringify(await blocos.obterUm(525)));