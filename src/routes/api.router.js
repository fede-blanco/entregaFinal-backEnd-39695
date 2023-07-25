import { Router } from 'express'
import { usersRouter } from './users.router.js'
import sessionsRouter from './sessions.router.js'
import { docsRouter } from './docs.router.js'

export const apiRouter = Router()


// se agrega una ruta hacia la documentación de la API
apiRouter.use("/docs", docsRouter)


//Dentro del api router (que va a ser como la ruta principal hacia los recursos de la api) vamos a anidar el router para usuarios y para sesiones, los cuales cada uno van a tener sus endpoints
apiRouter.use('/users', usersRouter)
apiRouter.use('/sessions', sessionsRouter)

