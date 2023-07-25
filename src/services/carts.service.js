import { winstonLogger } from "../middlewares/winstonLogger.js";
import { cartsRepository } from "../repositories/carts.repository.js";

//Capa de "services" para utilizar como intermediario entre la logica de negocio y el acceso a la base de datos para su proteccion

class CartsService {
  //Agregar carrito
  async addCart(cartOwnerId) {
    try {
        const cart = await cartsRepository.addCart(cartOwnerId)
        winstonLogger.info(`Carrito creado - ${new Date().toLocaleTimeString()}`)
        return cart
        // return await cartManager.addCart()
    } catch (error) {
      winstonLogger.error(`Error en addCart - carts.service.js + ${error}`)
      throw new Error(`Error en addCart - carts.service.js + ${error}`)
    }
  }

  //Agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    try {

        let prodToCart = await cartsRepository.addProductToCart(cartId,productId)
        winstonLogger.info(`Producto ${productId} agregado al carrito ${cartId} exitosamente - ${new Date().toLocaleTimeString()}`)
        return prodToCart
      // return await cartManager.addProdToCart(cartId,productId)
    } catch (error) {
      winstonLogger.error(`Error en addProductToCart - cart.service.js + ${error}`)
      throw new Error(`Error en addProductToCart - cart.service.js + ${error}`)
    }
  }

  //Modificar productos de un carrito mediante un array de productos con formato objectId
  async updateCartProducts (cartId, productsArray) {
    try {
      return await cartsRepository.updateCartProducts (cartId, productsArray)
      // return await cartManager.updateCartProducts (cartId, productsArray)
    } catch (error) {
      throw new Error(`Error en updateCartProducts - cart.service.js + ${error}`)
    }
  }

  //Modificar un producto del carrito 
  async updateCartProductById(cartId, productId, quantity) {
    try {
      return await cartsRepository.updateCartProductById(cartId, productId,quantity)
      // return await cartManager.updateCartProductById(cartId, productId,quantity)
    } catch (error) {
      throw new Error(`Error en updateCartProductById - cart.service.js + ${error}`)
    }

  }

  //eliminar producto del carrito
  async deleteProductFromCart (cartId, productId){
    try {
      return await cartsRepository.deleteProdFromCart(cartId, productId)
      // return await cartManager.deleteProdFromCart(cartId, productId)
    } catch (error) {
      throw new Error(`Error en deleteProductFromCart - cart.service.js + ${error}`)
    }
  }

  //Eliminar todos los productos del carrito
  async deleteAllCartProducts (cartId) {
    try {
      return await cartsRepository.deleteAllCartProducts(cartId)
      // return await cartManager.deleteAllCartProducts(cartId)
    } catch (error) {
      throw new Error(`Error en deleteAllCartProducts - cart.service.js + ${error}`)
    }
  }

  //eliminar todas las existencias de un producot del carrito
  async deleteFullProductFromCart (cartId, productId){
    try {
      return await cartsRepository.deleteFullProductFromCart(cartId,productId)
      // return await cartManager.deleteFullProductFromCart(cartId,productId)
    } catch (error) {
      throw new Error(`Error al realizar deleteFullProductFromCart - carts.service: --> ${error}`)
    }
  }

  //obtener un carrito mediante su id
  async getCartById(cartId) {
    try {
      return await cartsRepository.getCartById(cartId)
      // return await cartManager.getCartById(cartId)
    } catch (error) {
      `Error: the product whith the id:${cartId} do not exist in the array!!`
    }
  }

  //obtener un carrito mediante el id de su duanio
  async getCartByOwnerId(cartOwnerId) {
    try {
        // console.log("****** linea 101 -- carts.service ");
        // console.log(cartOwnerId);
        const cart = await cartsRepository.getCartByOwnerId(cartOwnerId)
        return cart
      // return await cartManager.getCartById(cartId)
    } catch (error) {
      `Error: the cart for the id:${cartOwnerId} do not exist in the array!!`
    }
  }

  //obtener todos los carritos de la coleccion "carts"
  async getCarts() {
    try {
      return await cartsRepository.getCarts()
      // return await cartManager.getCarts()
    } catch (error) {
      throw new Error(`Error al realizar getCarts - carts.service: --> ${error}`)
    }
  }

}

export const cartsService = new CartsService()