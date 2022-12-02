import * as fs from 'node:fs/promises';
import { Votacoes } from './main.js';

const votacoes = new Votacoes();
const todas = await votacoes.obterTodas();

const ids: string[] = []
for (const votacao of todas) {
    ids.push(votacao.id)
};

const votos: unknown[] = [];

async function* obterVotos() {
    for (const id of ids) {
        const vot = await votacoes.obterVotos(id);
        if (vot.length > 0) {
            yield vot;
        } else {
            yield null;
        };
    };
};

for await (const voto of obterVotos()) {
    if (!Array.isArray(voto)) continue;
    votos.push(voto);
}

fs.writeFile('test.json', JSON.stringify(votos));