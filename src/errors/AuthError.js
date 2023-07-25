
export class AuthError extends Error {
    constructor(mensaje = 'error de autenticacion') {
        super(mensaje);
        this.tipo = 'AUTH_ERROR';
    }
}
