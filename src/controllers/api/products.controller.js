import { emailService } from "../../services/email.service.js"
import { productsService } from "../../services/products.service.js"
import { usersService } from "../../services/users.service.js"

//Funcion que Controla la acción de la url (GET) "/api/products"  --> version con pagination
export async function productsController(req, res) {
  try {
    const options = {
      //variables que se van a conseguir de los parametros pasador por el url
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      sort: req.query.sort || null,
      query: req.query.query || null,
      url: req.originalUrl.split("?")[0] || req.originalUrl,
    }

    const products = await productsService.getProducts(options)

    // se crea el objeto que se enviara como respuesta
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
    res.json(response)
  } catch (error) {
    throw new Error(
      `Hubo un problema con get products: ${error} --> products.controller.js + ${error}`
    )
  }
}

//Funcion que Controla la acción de la url (GET) "/api/products/:pid"
export async function productByIdController(req, res) {
  try {
    const idParam = req.params.pid

    // const product = await productsManager.getProductById(idParam);
    const product = await productsService.getProductById(idParam)
    res.json(product)
  } catch (error) {
    throw new Error(
      `Error al buscar el producto con el id: ${idParam}  --> products.controller.js + ${error}`
    )
  }
}

//Funcion que Controla la acción de la url (POST) "/api/products"
export async function addProductController(req, res, next) {
  try {
    const productToAdd = req.body
    const ownerId = req.user._id
    productToAdd.owner = ownerId
    const addedProduct = await productsService.addProduct(productToAdd)
    res.status(201).json(addedProduct)
  } catch (error) {
    res.status(400).json({ msg: error.message })
    throw new Error(
      `Error en addProductController -- > products.controller.js + ${error}`
    )
  }
}

//////Funcion que Controla la acción de la url (PUT) "/api/products/:pid"
export async function updateProductController(req, res) {
  try {
    const newProperties = req.body.prod
    const productId = req.params.pid

    const updatedProduct = await productsService.updateProduct(
      productId,
      newProperties
    )
    res.json(updatedProduct)
  } catch (error) {
    throw new Error(
      `Error en updateProductController -- > products.controller.js + ${error}`
    )
  }
}

//Funcion que Controla la acción de la url (DELETE) "/api/products/:pid"
export async function deleteProductController(req, res) {
  try {
    const prodToDeleteId = req.params.pid
    console.log("prodToDeleteId: ",prodToDeleteId)

    const currentUserId = req.user._id
    console.log("currentUserId: ", currentUserId)

    // ********************   OBTENCIÓN DE PRODUCTO Y OWNER   ********************
    const productToDelete = await productsService.getProductById(prodToDeleteId)
    const productOwner = await usersService.getUserById(productToDelete.owner)
    console.log("productToDelete: ", productToDelete)
    console.log("productOwner: ", productOwner)
    console.log("productToDelete.owner: ", productToDelete.owner)
    console.log("productOwner._id: ", productOwner._id)

    if (`${currentUserId}` === `${productOwner._id}`) {
        console.log(" ****** MISMO USUARIO ******")

        if (productOwner?.role === 'premium'){
          //  ******************** ENVIO DE EMAIL *******************
          const emailOptions = {
              receiver: productOwner.email,
              subject: `Producto eliminado exitosamente - ID: ${productToDelete._id}`,
              message: `Usuario "${productOwner?.email}", El producto "${productToDelete.title}" fue eliminado exitosamente`,
          }
          await emailService.send(emailOptions)
        }

        // ****************** ELIMINACIÓN DEL PRODUCTO ********************
        const arrayWhithoutProduct = await productsService.deleteProduct(
          prodToDeleteId
        );

        // ********************** RESPUESTSA ************************
        res.status(201).json(arrayWhithoutProduct)
        
    } else {
        console.log(" ****** DIFERENTE USUARIO ******")
        res.json({
            productToDelete: productToDelete,
            productOwner: productOwner,
            currentUserId: currentUserId,
        })
    }
  } catch (error) {
    throw new Error(
      `Error en deleteProductsController -- > products.controller.js + ${error}`
    )
  }
}
