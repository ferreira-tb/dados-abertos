import * as fs from 'node:fs/promises';
import { Orgaos } from './main.js';

const agora = new Date();
const antes = new Date(new Date().setMonth(0));
fs.writeFile('test.json', JSON.stringify(await Orgaos.obterVotacoes(4, { dataInicio: antes, dataFim: agora })));

/*
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
}*/