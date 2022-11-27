import { APIError } from "../error.js";

/**
 * Verifica se a data obedece ao formato `AAAA-MM-DD`.
 * @param data Data a ser verificada.
 */
export function verificarData(data: unknown): boolean {
    if (typeof data !== 'string') throw new APIError(`${data} não é uma data válida.`);

    const camposData = data.split('-');
    if (camposData.length !== 3) throw new APIError(`${data} não é uma data válida.`);

    camposData.forEach((campo, indice) => {
        if (indice === 0 && campo.length !== 4) {
            throw new APIError(`${data} não é uma data válida.`);
        } else if (indice !== 0 && campo.length !== 2) {
             throw new APIError(`${data} não é uma data válida.`);
        };

        const numero = Number.parseInt(campo, 10);
        if (Number.isNaN(numero)) throw new APIError(`${data} não é uma data válida.`);
    });

    return true;
};