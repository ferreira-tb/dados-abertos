export class APIError extends Error {
    readonly status?: number;
    /**
     * @param message Mensagem do erro.
     * @param status Status HTTP.
     */
    constructor(message: string, status?: number) {
        super(message);

        if (typeof status === 'number') this.status = status;
    };

    /**
     * Emite um erro caso o status seja 400, 404 ou 500.
     * @param status Status HTTP.
     */
    public static handleStatus(status: number) {
        switch (status) {
            case 400: throw new APIError('400: Requisição inválida.', status);
            case 404: throw new APIError('404: A URL passada se refere a um recurso que não existe no sistema.', status);
            case 500: throw new APIError('500: Erro interno no servidor da Câmara dos Deputados.', status);
        };
    };
};