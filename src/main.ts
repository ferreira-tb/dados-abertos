import * as fs from 'node:fs/promises';
import Partidos from "./endpoints/partidos.js";

const partidos = new Partidos();
fs.writeFile('test.json', JSON.stringify(await partidos.obterLideres(36898)));