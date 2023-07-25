import { Router } from "express";
import { getCurrentSessionController, loginController, logoutController} from "../controllers/api/sessions.controller.js";
import { antenticacionPorGithub_CB, autenticacionJwtAlreadyLogged, autenticacionJwtApi, autenticacionPorGithub, autenticacionUserPass } from "../middlewares/passport.js";
import { encriptarJWT } from "../utils.js";

//creamos el router de sesiones
const sessionsRouter = Router()

// sessionsRouter.post('/register', registerUserController)

sessionsRouter.post('/login', autenticacionUserPass, loginController)

sessionsRouter.get('/logout', autenticacionJwtApi, logoutController)

// datos de sesion, para testear!
sessionsRouter.get('/current', autenticacionJwtApi, getCurrentSessionController)

// login con github
//Se agregan las dos rutas que pide github y passport
sessionsRouter.get('/github', autenticacionPorGithub) // --> url a la cual se va a acceder desde el cliente (a la que redirigirá el boton que haya en la vista)
sessionsRouter.get('/githubcallback', antenticacionPorGithub_CB, (req, res, next) => {
      //Es importante que la guardemos con el mismo nombre (jwt_authorization) que despues la vamos a buscar
      res.cookie('jwt_authorization', encriptarJWT(req.user), {
        signed: true,
        httpOnly: true
      })
  
      res.status(201)

      res.redirect('/products') // --> No puedo enviar las 2 respuestas a la vez
  })

export default sessionsRouter;