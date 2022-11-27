import { APIError } from "../error.js";

/**
 * Verifica se a data obedece ao formato `AAAA-MM-DD`.
 * @param data Data a ser verificada.
 */
export function verificarData(data: unknown): data is string {
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

        if (indice === 1 && (numero < 1 || numero > 12)) throw new APIError(`${data} não é uma data válida.`);
        if (indice === 2 && (numero < 1 || numero > 31)) throw new APIError(`${data} não é uma data válida.`);
    });

    return true;
};

/**
 * Verifica se o ID é um número inteiro e positivo.
 * Se não for inteiro, emite um erro, mas, caso seja negativo, retorna seu valor absoluto.
 * @param id ID a ser verificado.
 */
export function verificarID(id: unknown): number {
    if (typeof id !== 'number' || !Number.isInteger(id)) {
        throw new APIError(`${id} não é um ID válido.`);
    };

    // Garante que o número seja positivo.
    const idVerificado = Math.abs(id);
    return idVerificado;
};