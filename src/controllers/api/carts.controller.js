import { cartsService } from "../../services/carts.service.js";
import { productsService } from "../../services/products.service.js";
import { ticketsService } from "../../services/tickets.service.js";


//Funcion que Controla la acción de la url (POST) "/api/carts"
export async function addCartController(req, res) {
  try {
    const NewCart = await cartsService.addCart(cartOwnerId);
    res.status(200).json({
      success: true,
      message: 'cart added successfully',
      cart: NewCart
    })
  } catch (error) {
    throw new Error(` ${error.message} --> carts.controller.js`);
  }
}

//Funcion que Controla la acción de la url (GET) "/api/carts/:cid"
export async function cartByIdController(req, res) {
  try {
    const idParam = req.params.cid;
    const cart = await cartsService.getCartById(idParam);
    res.json(cart);
  } catch (error) {
    throw new Error(`Error al buscar el producto con el id: ${idParam} --> carts.controller.js`);
  }
}

//Funcion que Controla la acción de la url (POST) "/api/carts/:cid/products/:pid"
export async function addProdToCartByIdController(req, res,next) {
  try {
    const cartIdParam = req.params.cid;
    const productId = req.params.pid;
    // console.log("cartIdParam --> ", cartIdParam);
    // console.log("productId --> ", productId.toString());
    const cart = await cartsService.getCartById(cartIdParam);
    const product = await productsService.getProductById(productId)
    
    const cartOwner = cart.cartOwner.toString()
    const productOwner = product.owner.toString()

    if(cartOwner === productOwner){
        console.log(`**********\ncartOwner --> "${cartOwner}" and productOwner --> ${productOwner} are the same person.\n********`);
        res.status(500).json({
            success: false,
            message: `**********\ncartOwner --> "${cartOwner}" and productOwner --> ${productOwner} are the same person.\n********`
          });
    } else {
        const productCreated = await cartsService.addProductToCart(
          cartIdParam,
          productId
        );
        
        res.status(200).json({
          success: true,
          message: 'Product added to cart successfully',
          cart: productCreated
        });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error adding product to cart'
    });
  }
}

//Funcion que Controla la acción de la url (PUT) "/api/carts/:cid"
export async function updateCartProductsByIdController(req, res){
  try {
    const cartId = req.params.cid
    const productsArray = req.body

    // Valida que el array sea valido
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res.status(400).json({ message: 'Invalid products array' });
    }
  
    const updatedCart = await cartsService.updateCartProducts(cartId, productsArray)

    res.status(200).json({
      success: true,
      message: 'cart products updated successfully',
      cart: updatedCart
    });
    
  } catch (error) {
    throw new Error(`Error en updateCartProductsByIdController - carts.controller.js + ${error}`)
  }
}


//Funcion que Controla la acción de la url (PUT) "/api/carts/:cid/products/:pid"
export async function updateCartProductByIdController (req,res){
  try {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = req.body.quantity

    const updatedCart = await cartsService.updateCartProductById(cartId,productId,quantity)

    res.status(200).json({
      success: true,
      message: 'cart product quantity updated successfully',
      cart: updatedCart
    })
    
  } catch (error) {
    throw new Error(`Error en updateCartProductByIdController - carts.controller.js + ${error}`)
  }
}


//Funcion que Controla la acción de la url (DELETE) "/api/carts/:cid/products/:pid"
export async function deleteFullProductByIdController(req,res) {
  try {
    const cartId = req.params.cid
    const productId = req.params.pid
    
    const updatedCart = await cartsService.deleteFullProductFromCart(cartId, productId)
    res.status(200).json({
      success: true,
      message: 'Product deleted to cart successfully',
      cart: updatedCart
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product to cart'
    });
    throw new Error(`Error al eliminar producto al carrito - deleteFullProductByIdController - carts.controller.js: ${error}`);
  }
  
}

//Funcion que Controla la acción de la url (DELETE) "/api/carts/:cid"
export async function deleteAllCartProductsController (req,res) {
  try {
    const cartId = req.params.cid

    const cartWithDeletedProducts = await cartsService.deleteAllCartProducts(cartId)

    res.status(200).json({
      success: true,
      message: "Products from cart deleted Successfully",
      cart: cartWithDeletedProducts
    });

  } catch (error) {
    throw new Error(`Error en deleteAllCartProductsController - carts.controller.js + ${error}`)
  }
}


//Funcion que Controla la acción de la url (POST) "/api/carts/:cid/purchase"
export async function purchaseCartProductsController(req, res){
  try {
    const cartId = req.params.cid
    const userEmail = req.user.email
    const {productsIds, addedTicket} = await ticketsService.addTicket(cartId, userEmail)
    await res.status(201).json({productsIds, addedTicket});
    
  } catch (error) {
    throw new Error(`Error en purchaseCartProductsController - carts.controller.js + ${error}`)
  }
}