import passport from 'passport'
import { AuthError } from '../errors/AuthError.js'

// Importamos la estrategia de github desde passport-github2
import { Strategy as GithubStrategy } from 'passport-github2'
// Importamos la estrategia LocalStrategy desde passport-local
import { Strategy as LocalStrategy} from 'passport-local'
//Para mas orden y porque son datos sensibles, modularizamos y traemos las variables con los datos para la estrategia de github desde un archivo auth.config.js
import { githubCallbackUrl, githubClientSecret, githubClienteId } from '../config/auth.config.js'
import { User } from '../models/User.js'
import { usersService } from '../services/users.service.js'

// importas para JWT
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { JWT_PRIVATE_KEY } from '../config/auth.config.js'

//Estrategia de login por jasonwebtoken JWT que lo va a estraer y guardarlo en la peticion
passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
      //Toda esta funcion podria estar modularizada e importada y utilizada aqui
      function (req) {
        let token = null
        //se fija que tmb haya signedCookies para que no este corrompida
        if (req && req.signedCookies) {
            //Lo busca en las signedCookies con el nombre "jwt_authorization" por lo cual al guardarlo se debe hacer con el mismo nombre
            token = req.signedCookies['jwt_authorization']
        }
        return token
    }
  
  ]),
    secretOrKey: JWT_PRIVATE_KEY,
}, async (jwt_payload, done) => {
    try {
      //Aqui podria haber algun tipo de validacion (que el token este y q sea valido por ej)
        done(null, jwt_payload) // null indica que no hay error y payload es el contenido del token, ya descifrado
    } catch (error) {
      // Se podria poner un error personalizado
        done(error)
    }
}))


//******** se crean los middlewares de autenticacion de JWT ****************/
// Se crean estas dos funciones separadas para api y par aviews para poder hacer un mejor manejo de errores

export function autenticacionJwtApi(req, res, next) {
  //usamos la estrategia para autenticar el token
    passport.authenticate('jwt', (error, user, info) => {
        if (error || !user) return next(new AuthError())
        // cargo el usuario en la peticion
        req.user = user
        // Hay que hacer estas funciones que se autoinvocan porque passport.authenticate no tiene "next()" por lo que el que debemos utilizar es el que viene del middleware que nosotros creamos al cual le pasamos ese "next()" como parametro
        next()
    })(req, res, next) // --> El middleware automaticamente invoca a la estrategia de passport.authenticate como si fuera express (req, res, next)
}

export function autenticacionJwtView(req, res, next) {
    passport.authenticate('jwt', (error, user) => {
        if (error || !user) return res.redirect('/login')
        req.user = user
        next()
    })(req, res, next) // --> El middleware automaticamente invoca a la estrategia de passport.authenticate como si fuera express (req, res, next)
}

export function autenticacionJwtAlreadyLogged(req, res, next) {
  passport.authenticate('jwt', (error, user) => {
    if(error || !user){
      return next()
    } 
    req.user = user
    return res.redirect('/products')
  })(req, res, next)
}
//********************************************* */


// Estrategia de login local
passport.use('local', new LocalStrategy({ usernameField: 'email', }, async ( username, password, done) => {
  try {
    // esto es lo que estaba en el controller de login
    const user = await usersService.getUserByEmail(username)
    if (!user){
      return done(new AuthError())
    }
    if (!isValidHash(password, user.password)) {
      return done(new AuthError())
    }
    delete user.password
    //Va a guardar el usuario en req.user pero no lo guardara en una session porque no las estamos utilizando
    done(null, user)
  } catch (error) {
    done(error, null)
  }
}))

//Estrategia de login mediante github
passport.use('github', new GithubStrategy({
    clientID: githubClienteId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl
}, async (accessToken, refreshToken, profile, done) => {
  //devuelve el perfil de github que tiene mucha info, la cual podamos usar (tanta info como datos tenga cargados el ususario de github)

    let user

    try {
        user = await usersService.getUserByEmail(profile._json.email)
    } catch (error) {
        let userRole;

        if(user["email"] === "adminCoder@coder.com"){
         userRole = "admin"
       } else {
         userRole = "user"
       }

        // @ts-ignore
        user = new User({
            first_name: profile._json.name.split(" ")[0],
            last_name: profile._json.name.split(" ")[1],
            email: profile._json.email,
            password: null,
            age: null,
            role: userRole,
        })

        await usersService.addUser(user)
    }
    done(null, user)
}))

// estos son para cargar en express.passport y express.session como middlewares a nivel aplicacion(en main.js)
export const passportInitialize = passport.initialize()

// estos son para cargar como middlewares antes de los controladores correspondientes
//Utilizan el passport.autenticate con la estrategia de github
//"session: false" --> al venir por defecto en true le debo decir a las estrategias que no quiero usar session para que no ahga nada al respecto de la misma
export const autenticacionUserPass = passport.authenticate('local', {
  session:false, 
  failWithError: true,
   })
export const autenticacionPorGithub = passport.authenticate('github', {
  session:false,
   failWithError: true,
   scope: ['user:email'] })
export const antenticacionPorGithub_CB = passport.authenticate('github', {
  session:false, failWithError: true })


