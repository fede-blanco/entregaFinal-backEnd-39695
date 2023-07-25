import { cartsService } from "../../services/carts.service.js"
import { productsService } from "../../services/products.service.js"

//**************************************************************************/
//**********  Rutas relacionadas al "products" y "carts" *******************/
//**************************************************************************/

// // Controla la acción de la url "/api/products" y ---> version anterior (sin modificar)
export async function productsController(req, res) {

  try {
    const options = {
      //variables que se van a conseguir de los parametros pasador por el url
      limit : req.query.limit || 10,
      page : req.query.page || 1,
      sort : req.query.sort || null,
      query : req.query.query || null,
      url: req.originalUrl.split("?")[0] || req.originalUrl,
    }

    const products = await productsService.getProducts(options)

    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    }

    res.render ("index", {
      hayProductos: response.payload.length > 0,
      response,
      user: req.user,
    })

  } catch (error) {
    throw new Error(`Hubo un problema con get products`)
  }
}

//Funcion que Controla la acción de la url (GET) "/realtimeproducts" 
export async function realTimeProductsController(req, res) {
  try {
    const options = {
      //variables que se van a conseguir de los parametros pasador por el url
      limit : req.query.limit || 10,
      page : req.query.page || 1,
      sort : req.query.sort || null,
      query : req.query.query || null,
      url: req.originalUrl.split("?")[0] || req.originalUrl,
    }

    const products = await productsService.getProducts(options)

    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    }

    const cartOwnerId = req.user._id
    const cartSelected = await cartsService.getCartByOwnerId(cartOwnerId)
    const cartSelectedId = cartSelected._id

    const currentUserId = req.user._id
    
    const cartResponse = {
      status: "success",
      payload: cartSelected.products,
    }

    res.render("realTimeProducts", {
      hayProductos: response.payload.length > 0,
      hayProductosCart: cartResponse.payload.length > 0,
      response,
      currentUserId,
      cartResponse,
      style:"index.css",
      title: "Productos en tiempo Real",
      cartSelectedId
    })
  } catch (error) {
    throw new Error(`Error en realTimeProductsController - views.router.js ${error}`)
  }
}

//Funcion que Controla la acción de la url (GET) "/"
export async function productsViewController(req, res, next) {
  try {
    const options = {
      //variables que se van a conseguir de los parametros pasador por el url
      limit : req.query.limit || 10,
      page : req.query.page || 1,
      sort : req.query.sort || null,
      query : req.query.query || null,
      url: req.originalUrl.split("?")[0] || req.originalUrl,
    }

    const products = await productsService.getProducts(options)

    const response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    }

    if(options.page > response.totalPages){
      throw new Error(`Se ingreso un numero de pagina mayor a la cantidad de paginas de productos existentes - El maximo es: " ${response.totalPages} "`)
    }

    const cartOwnerId = req.user._id
    const cartSelected = await cartsService.getCartByOwnerId(cartOwnerId)
    const cartSelectedId = cartSelected._id
    
    const cartResponse = {
      status: "success",
      payload: cartSelected.products,
    }

    res.render("products", {
      hayProductos: response.payload.length > 0,
      hayProductosCart: cartResponse.payload.length > 0,
      response,
      cartResponse,
      style:"index.css",
      title: "Vista con listado de Productos y Paginacion",
      cartSelectedId,
      user: req.user
    })
  } catch (error) {
    throw new Error(`Hubo un error en viewsProductsController - views.controller.js ${error}`)
  }
}

//Funcion que Controla la acción de la url (GET) "/carts/:cid" 
export async function cartViewController(req, res) {
  try {
    const cartId = req.params.cid;
      const options = {
        //variables que se van a conseguir de los parametros pasador por el url
        limit : req.query.limit || 10,
        page : req.query.page || 1,
        sort : req.query.sort || null,
        query : req.query.query || null,
        url: req.originalUrl.split("?")[0] || req.originalUrl,
      }
  
      const products = await productsService.getProducts(options)
  
      const response = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
      }

    //   Busco el "cart" mediante el Id
      const cartSelected = await cartsService.getCartById(cartId)
      const cartSelectedId = cartSelected._id
      const cartSelectedIdString = `${cartSelectedId}`
      
      const cartResponse = {
        status: "success",
        payload: cartSelected.products,
      }
  
      res.render("cart", {
        hayProductos: response.payload.length > 0,
        hayProductosCart: cartResponse.payload.length > 0,
        response,
        cartResponse,
        style:"index.css",
        title: "Vista con listado de Productos y Paginacion",
        cartSelectedId
      })
    
  } catch (error) {
    throw new Error(`Hubo un error en cartViewController - views.router.js ${error}`)
  }}

//***************************************************************/
//**********  Rutas relacionadas al "chat" **********************/
//***************************************************************/

//Funcion que Controla la acción de la url (GET) "/chat" 
export async function chatViewController(req,res){try {
    res.render('chat' , {
      style: 'index.css',
      pageTitle: "Chat Comunitario",
      userName: `${req.user.first_name} ${req.user.last_name}`
    }) 
  } catch (error) {
    throw new Error(`Hubo un error en registerViewController - views.router.js ${error}`)
  }
}

//***************************************************************/
//**********  Rutas relacionadas al "registro" y al "login" *****/
//***************************************************************/

  //Funcion que Controla la acción de la url (GET) "/register" 
  export async function registerViewController(req, res,next){
      try {
        res.render('register' , {
          style: 'index.css',
          pageTitle: "Registrate!!",
        }) 
      } catch (error) {
        throw new Error(`Hubo un error en registerViewController - views.router.js ${error}`)
      }
  }

  //Funcion que Controla la acción de la url (GET) "/login" 
  export async function loginViewController(req, res){
    try {
      res.render('login', {
        style: 'index.css',
        pageTitle: "Login",
        })
    } catch (error) {
      throw new Error(`Hubo un error en loginViewController - views.router.js ${error}`)
    }
  }

  //Funcion que Controla la acción de la url (GET) "/current" 
  export async function profileViewController(req, res){
    try {
      res.render('profile', {
        user: req.user,
        style: 'index.css',
        pageTitle: "Perfil del usuario"
      })
    } catch (error) {
      throw new Error(`Hubo un error en profileViewController - views.controller.js ${error}`)
    }
  }

  
//********************************************************************** */
//**********  Rutas relacionadas a la recuperacion de contraseña *********/
//********************************************************************** */

  //Funcion que Controla la acción de la url (GET) "/resetPassword" 
export async function resetPasswordMailViewController(req, res,next){
    // const passUpdatedUser = await usersService.updateUserPassword()
    try {
    res.render('resetPasswordMail' , {
        style: 'index.css',
        pageTitle: "Mail de reestablecimiento",
      }) 
    } catch (error) {
    throw new Error(`Hubo un error en resetPasswordMailViewController - views.router.js ${error}`)
}
}


  //Funcion que Controla la acción de la url (GET) "/resetPasswordForm" 
export async function resetPasswordFormViewController(req, res,next) 
{
    try {
        const token = req.query.token;
        const email = req.query.email;

        res.render('resetPasswordForm', {
            style: 'index.css',
            pageTitle: "Reestablecer contraseña",
            token: token,
            email: email,
        })
    } catch (error) {
        throw new Error(`Hubo un error en resetPasswordFormViewController - views.router.js ${error}`)
    }
}







  