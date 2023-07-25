export class PermitsError extends Error {
    constructor(mensaje = 'error de permisos') {
        super(mensaje);
        this.tipo = 'PERMITS_ERROR';
    }
}
