
import { PermitsError } from '../errors/PermitsError.js'

export function soloLogueadosApi(req, res, next) {
    // acá uso el atajo que me provee passport para ver
    // si hay una sesion inicializada por un usuario
    if (!req.user) {
        return next(new PermitsError())
    }
    // continua el flujo normal del caso de uso
    next()
}

export function soloLogueadosView(req, res, next) {
    // acá uso el atajo que me provee passport para ver
    // si hay una sesion inicializada por un usuario
    if (!req.user) {
        return res.redirect('/login')
    }
    next()
}


//funcion de primer orden (funcion que devuelve un middleware, un callback) que verifica si el rol es el mismo y permite seguir o da error
export function RoleAuth(role) {
   return (req, res, next) => {
      if (role.includes(req.user?.role)) return next()
      return next(new PermitsError(`solo disponible para rol '${role}'`))
  }
}

export function RoleAuthMany(roles) {
   return (req, res, next) => {
      if ( roles.includes(req.user?.role)) return next()
      return next(new PermitsError(`Solo disponible para los roles: '${roles.join(", ")}'`))
  }
}
