import { usersService } from "../../services/users.service.js"
import { encriptarJWT } from "../../utils.js"


//Funcion que Controla la acción de la url (GET) "/api/sessions/login"
export async function loginController (req, res, next) {

    const properties = {
        last_connection : new Date()
    }

    const updatedUser = await usersService.updateUserById(req?.user._id, properties)
      // Para no perder la info de ese usuario (al ya no guardarse en ninguna session en el servidor) se encripta y se envia en una cookie
      //Es importante que la guardemos con el mismo nombre (jwt_authorization) que despues la vamos a buscar
      res.cookie('jwt_authorization', encriptarJWT(req.user), {
        signed: true,
        httpOnly: true
      })
  
      return res.status(201).json(req.user)
}

//Funcion que Controla la acción de la url (GET) "/api/sessions/logout"
export async function logoutController (req, res, next) {

    const date = new Date();
    const properties = {
        last_connection : date

    }

    const updatedUser = await usersService.updateUserById(req?.user._id, properties)

    res.clearCookie('jwt_authorization', {
        signed: true,
        httpOnly: true
    })

    res.sendStatus(200)

}

//Funcion que Controla la acción de la url (GET) "/api/sessions/current"
export function getCurrentSessionController(req, res, next) {
  // passport guarda la sesion directamente en ** req.user ** en lugar del campo session de la peticion !
  return res.json(req.user)
}