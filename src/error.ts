export class APIError extends Error {
    constructor(message: string) {
        super(message);
    };

    /**
     * Retorna `false` caso o status seja igual a 400 ou 404 e emite um erro caso seja 500.
     * Em outros casos, retorna `true`.
     * @param status Status HTTP.
     */
    public static handleStatus(status: number): boolean {
        if (status === 400 || status === 404) return false;

        if (status === 500) {
            throw new APIError('500: Erro interno no servidor da Câmara dos Deputados.');
        };

        return true;
    };
};