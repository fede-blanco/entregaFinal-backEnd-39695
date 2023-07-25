import { Router } from "express"
import { cartViewController, chatViewController, loginViewController, productsViewController, profileViewController, realTimeProductsController, registerViewController, resetPasswordMailViewController, resetPasswordFormViewController } from "../controllers/web/views.controller.js"
import { RoleAuthMany } from "../middlewares/soloLogueados.js"
import { autenticacionJwtAlreadyLogged, autenticacionJwtView } from "../middlewares/passport.js"

const viewsRouter = Router()


// seria la url --> http://localhost:8080/realtimeproducts
viewsRouter.get("/realtimeproducts",autenticacionJwtView, RoleAuthMany(["admin", "premium"]), realTimeProductsController) //devuelve una vista que contiene 3 formularios (agregar/actualizar/eliminar productos de "products"), una lista de productos y una vista del carrito en la posicion [0] de "carts".

// seria la url --> http://localhost:8080/products
viewsRouter.get("/products", autenticacionJwtView, productsViewController) //--> Devuelve una vista de los productos en "products" con estilos y su numero de pagina con la paginacion posible mediante la url

// seria la url --> http://localhost:8080/carts/:cid
viewsRouter.get("/carts/:cid", cartViewController) //--> devuelve una vista de un carrito seleccionado mediante su id con estilos


//-------  Rutas relacionadas al "chat" ---------
viewsRouter.get("/chat", autenticacionJwtView,  chatViewController)


// -------   ruta "current" con info del usuario logueado ----
viewsRouter.get("/current", autenticacionJwtView, profileViewController)


// -------   ruta "resetPasswordMail" que tiene un boton para enviar un mail ingresado  ----
viewsRouter.get("/resetPasswordMail", resetPasswordMailViewController)

// -------   ruta "resetPasswordForm" muestra un formulario que tiene un boton para enviar un formulario ocn la nueva contraseña  ----
viewsRouter.get('/resetPasswordForm', resetPasswordFormViewController)



//-------  Rutas relacionadas al "registro" y al "login" ---------

viewsRouter.get('/register', autenticacionJwtAlreadyLogged, registerViewController)

viewsRouter.get('/login', autenticacionJwtAlreadyLogged,  loginViewController)

// viewsRouter.get('/', soloLogueadosView, productsViewController)
viewsRouter.get('/', autenticacionJwtView, productsViewController)

//----------------------------------------------//
viewsRouter.get('*', (req, res) => {
  res.redirect('/login');
})


export default viewsRouter
