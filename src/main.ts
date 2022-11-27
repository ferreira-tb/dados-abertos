import * as fs from 'node:fs/promises';
import Partidos from "./endpoints/partidos.js";

const partidos = new Partidos();
const opcoes: EndpointOpcoes<OrdenarIDNomeSUF> = { dataInicio: '1980-01-02' }
fs.writeFile('test.json', JSON.stringify(await partidos.obterMembros(36898, opcoes)));