import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "./config/auth.config.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);



// irreversible!
export function createHash(frase) {
  return bcrypt.hashSync(frase, bcrypt.genSaltSync(10))
}

export function isValidHash(received, stored) {
  // return hashear(recibida) !== almacenada
  return bcrypt.compareSync(received, stored)
}

export function encriptarJWT(payload, expiration = '24h') {
  const token = jwt.sign(JSON.parse(JSON.stringify(payload)), JWT_PRIVATE_KEY, { expiresIn: expiration })
  return token
}

export function desencriptarJWT(token) {
    try {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_PRIVATE_KEY, (err, decodedPayload) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(decodedPayload)
                }
            })
        })
       
    } catch (error) {
        throw new Error(`Error de autenticacion: sesion expirada`)
    }
}



export default __dirname;