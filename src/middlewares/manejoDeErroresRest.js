import { AddProductError } from "../errors/AddProductError.js"
import { AuthError } from "../errors/AuthError.js"
import { PermitsError } from "../errors/PermitsError.js"

export function errorHandler(error, req, res, next) {

    if (error instanceof AuthError) {
        res.status(401)
    } else if (error instanceof PermitsError) {
        res.status(403)
    } else if (error instanceof AddProductError){
        res.status(404)
    } else {
        res.status(500)
    }

    res.json({ status: "error", errorMsg: error.message ?? 'Error interno: causa desconocida' })
}
