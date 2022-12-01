import { APIError } from "../error.js";

export async function obter<T extends TodosDados | TodosDados[], L extends CamaraEndpoints>(url: L): Promise<ResultadoBusca<T, L>> {
    const dados = await fetch(url);
    APIError.handleStatus(dados.status);
    return await dados.json() as ResultadoBusca<T, L>;
};

/**
 * Verifica se a data obedece ao formato `AAAA-MM-DD`.
 * @param data Data a ser verificada.
 */
export function verificarData(data: unknown): data is string {
    if (typeof data !== 'string' || !(/^\d\d\d\d\-\d\d\-\d\d$/.test(data))) {
        throw new APIError(`${data} não é uma data válida.`);
    };

    data.split('\-').forEach((campo, indice) => {
        const numero = Number.parseInt(campo, 10);
        if (Number.isNaN(numero)) throw new APIError(`${data} não é uma data válida.`);

        if (numero < 1 || (indice === 1 && numero > 12) || (indice === 2 && numero > 31)) {
            throw new APIError(`${data} não é uma data válida.`);
        };
    });

    return true;
};

export function verificarHora(hora: unknown): hora is string {
    if (typeof hora !== 'string' || !(/^\d\d\:\d\d$/.test(hora))) {
        throw new APIError(`${hora} não é uma hora válida.`);
    };

    hora.split('\:').forEach((campo, indice) => {
        const numero = Number.parseInt(campo, 10);
        if (Number.isNaN(numero)) throw new APIError(`${hora} não é uma hora válida.`);

        if (numero < 0 || (indice === 1 && numero > 24) || (indice === 2 && numero > 59)) {
            throw new APIError(`${hora} não é uma hora válida.`);
        };
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