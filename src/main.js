import express from "express"
import __dirname from "./utils.js"
import routerProducts from "./routes/routerProducts.js"
import routerCarts from "./routes/routerCarts.js"
import viewsRouter from "./routes/views.router.js"
import mocksRouter from "./routes/mocks.router.js"
import { productsService } from "./services/products.service.js"
//importamos el motor de planteillas de handlebars
import { engine } from "express-handlebars"
// Importamos el servidor de socket
import { Server as SocketIoServer } from "socket.io"
import { PORT } from "./config/server.js"
import { MONGODB_CNX_STR_REMOTE } from "./config/mongodb.js"
import mongoose from "mongoose"
import { cartsService } from "./services/carts.service.js"
import { errorHandler } from "./middlewares/manejoDeErroresRest.js"
import { passportInitialize } from "./middlewares/passport.js"
import { apiRouter } from "./routes/api.router.js"
//Hay que agregar cookie-parser para poder trabajar con JWT y guardarlo en una cookie
import cookieParser from "cookie-parser"
import { COOKIE_SECRET } from "./config/auth.config.js"
import { petitionLogger } from "./middlewares/petitionLogger.js"
import { winstonLogger } from "./middlewares/winstonLogger.js"
import loggerTestRouter from "./routes/loggerTest.router.js"
import { usersService } from "./services/users.service.js"
import { emailService } from "./services/email.service.js"

//creamos el servidos express en y lo almacenamos en la variable app
const app = express()
await mongoose.connect(MONGODB_CNX_STR_REMOTE)
winstonLogger.info(`conectado a mongodb Atlas - DB "coderhouse"`)

// Para recibir json en el cuerpo de la petición y recibir datos por url
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Hay que agregar cookie-parser para poder trabajar con JWT y guardarlo en una cookie y le psamos como parametro la palabra secreta para parsear
app.use(cookieParser(COOKIE_SECRET))

// Con app.engine decido que motor de plantillas voy a utilizar y en este caso elegimos "handlebars"
app.engine("handlebars", engine())
// Se le indica de que carpeta va a sacar las vistas a renderizar
app.set("views", `./views`)
// Tambien le indicamos el engine por defecto que utilizará, en caso de que un archivo no tenga extensión.
// Osea que si le indicamos "users" buscara un archivo "users.handlebars"
app.set("view engine", "handlebars")


//se carga passport en el servidor como middlewares
app.use(passportInitialize)
// app.use(passportSession) // --> lo comentamos luego de agregar JWT que cumple una funcion similar

//Es importante utilizar esta modalidad de rutear el static para poder poner JS y CSS en las plantillas
app.use(express.static(__dirname+'/public'))

//middleware que realiza logs de los metodos y urls de las peticiones realizadas
app.use(petitionLogger)

// implementamos los routers a ambas rutas
app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts)
app.use("/api", apiRouter)
app.use("/mockingproducts", mocksRouter)
app.use("/loggerTest", loggerTestRouter)
app.use("/", viewsRouter)



//middleware de manejo de errores
app.use(errorHandler)

// nos conectamos al puerto de entrada y salida
//agregamos "0.0.0.0" (hostname) a los puertos a escuchar para poder desplegarlo en un servicio externo desde cualquier ip
const ConnectedServer = app.listen(PORT, "0.0.0.0", () => {
    winstonLogger.info(`conectado servidor Express en el puerto ${PORT}`)
    console.log(`Conectado en el puerto ${PORT}`)
})

//creamos el servidor de socket.io
//Para construirse debe apoyarse en un servidor existente (un server HTTP)
const io = new SocketIoServer(ConnectedServer)

let messages = []; //--> Es la lista donde s eiran guardando los mensajes

io.on("connection", (socket) => {
  console.log("Cliente Conectado con socket.io!!")

  socket.on("addProduct", async (prod, options = {}) => {
    //Obtengo la lista de productos proveniente de json actualizada
    const data = await productsService.getProducts(options)
    const prodListItems = data.docs;
    //envio el mensaje con los productos al front
    socket.emit("updateProductsList", prodListItems )
  })
  
  socket.on("updateProduct", async (prodId, prod) => {
  //En el back modifico un producto al json
  await productsService.updateProduct(prodId, prod)
  //Obtengo la lista de productos proveniente de la base de datos actualizada
  const data = await productsService.getProducts(prod)
  const prodListItems = data.docs;
  //envio el mensaje con los productos al front
  socket.emit("updateProductsList",prodListItems )   
  })
  
  socket.on("deleteProduct", async ({productId, currentUserId}, options = "") => {

    // // ********************   OBTENCIÓN DE PRODUCTO Y OWNER   ********************
    const productToDelete = await productsService.getProductById(productId)
    const productOwner = await usersService.getUserById(productToDelete?.owner)
    console.log("productToDelete: ", productToDelete);
    console.log("productOwner: ", productOwner);

    console.log({
        currentUserId: `new ObjectId("${currentUserId}")`,
        productOwnerId: `new ObjectId("${productOwner._id}")`
    });
    console.log(productOwner._id);

    if (`${currentUserId}` === `${productOwner._id}`) {
        console.log(" ****** MISMO USUARIO ******");

        if (productOwner?.role === 'premium'){
            //  ***************************** ENVIO DE EMAIL *******************************
            const emailOptions = {
                receiver: productOwner?.email,
                subject: `Producto eliminado exitosamente - ID: ${productToDelete._id}`,
                message: `Usuario "${productOwner?.email}", El producto "${productToDelete.title}" fue eliminado exitosamente`,
            }
            await emailService.send(emailOptions)
            }
        
            // *********************   CODIGO ANTERIOR QUE FUNCIONA   *********************
            //En el back elimino un producto al json
            await productsService.deleteProduct(productId);
            //Obtengo la lista de productos proveniente de json actualizada
            const data = await productsService.getProducts(options)
            const prodListItems = data.docs;
            //envio el mensaje con los productos al front
            socket.emit("updateProductsList",prodListItems )   
            
        } else {
            console.log(" ****** DIFERENTE USUARIO ******");
            //Obtengo la lista de productos proveniente de json actualizada
            const data = await productsService.getProducts(options)
            const prodListItems = data.docs;
            //envio el mensaje con los productos al front
            socket.emit("updateProductsList",prodListItems )   
    }
  })

  socket.on("deleteProductFromCart", async ({cartId: cartId,  productId: productId}) => {

    //traingo el ObjectId del carrito
    const cartSelectedId = cartId

    //Le saco las comillas de los extremos
    const prodSinComillas = productId.replace(/`/g, '')

    //Genero un ObjectId de mongoose con este id
    const productObjId = new mongoose.Types.ObjectId(prodSinComillas);

    await cartsService.deleteFullProductFromCart(cartSelectedId, productObjId)

    //Obtengo la lista de productos en el carrito
    const cartUpdated = await cartsService.getCartById(cartSelectedId)

    const cartResponse = {
      status: "success",
      payload: cartUpdated.products,
      cartId: cartSelectedId,
    }
     //envio el mensaje con los productos al front
     socket.emit("updateCartList", cartResponse )  
  })

  socket.on("addProductToCart", async ({cartId: cartId,  productId: productId}) => {

    const cartSelectedId = cartId

    const cartUpdated = await cartsService.getCartById(cartSelectedId)
    // console.log("main.js -- 'addProductToCart' --->",cartUpdated);
    const cartResponse = {
      status: "success",
      payload: cartUpdated.products,
    }

    socket.emit("updateCartList", cartResponse)
  })

  //  --------------   CHAT  -------------

  socket.on("message", data => {
    messages.push(data)
    io.emit("messageLogs", messages)
  })
})