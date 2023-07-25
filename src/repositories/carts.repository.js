import { cartManager } from "../managers/CartManager.js";

//Capa de "services" para utilizar como intermediario entre la logica de negocio y el acceso a la base de datos para su proteccion

class CartsRepository {

  //Agregar carrito
  async addCart(cartOwnerId) {
    try {
      return await cartManager.addCart(cartOwnerId)
    } catch (error) {
      throw new Error(`Error en addCart - carts.repository.js + ${error}`)
    }
  }

  //Agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      return await cartManager.addProdToCart(cartId,productId)
    } catch (error) {
      throw new Error(`Error en addProductToCart - cart.repository.js + ${error}`)
    }
  }

  //Modificar productos de un carrito mediante un array de productos con formato objectId
  async updateCartProducts (cartId, productsArray) {
    try {
      return await cartManager.updateCartProducts (cartId, productsArray)
    } catch (error) {
      throw new Error(`Error en updateCartProducts - cart.repository.js + ${error}`)
    }
  }

  //Modificar un producto del carrito 
  async updateCartProductById(cartId, productId, quantity) {
    try {
      return await cartManager.updateCartProductById(cartId, productId,quantity)
    } catch (error) {
      throw new Error(`Error en updateCartProductById - cart.repository.js + ${error}`)
    }

  }

  //eliminar producto del carrito
  async deleteProductFromCart (cartId, productId){
    try {
      return await cartManager.deleteProdFromCart(cartId, productId)
    } catch (error) {
      throw new Error(`Error en deleteProductFromCart - cart.repository.js + ${error}`)
    }
  }

  //Eliminar todos los productos del carrito
  async deleteAllCartProducts (cartId) {
    try {
      return await cartManager.deleteAllCartProducts(cartId)
    } catch (error) {
      throw new Error(`Error en deleteAllCartProducts - cart.repository.js + ${error}`)
    }
  }

  //eliminar todas las existencias de un producot del carrito
  async deleteFullProductFromCart (cartId, productId){
    try {
      return await cartManager.deleteFullProductFromCart(cartId,productId)
    } catch (error) {
      throw new Error(`Error al realizar deleteFullProductFromCart - carts.repository: --> ${error}`)
    }
  }

  //obtener un carrito mediante su id
  async getCartById(cartId) {
    try {
      return await cartManager.getCartById(cartId)
    } catch (error) {
      `Error: the product whith the id:${cartId} do not exist in the array!!`
    }
  }

  //obtener un carrito mediante el id de su duenio
  async getCartByOwnerId(cartOwnerId) {
    try {
        // console.log("****** linea 84 -- carts.repository.js ****");
        // console.log(cartOwnerId);
        const cart = await cartManager.getCartByOwnerId(cartOwnerId)
        return cart
    } catch (error) {
      `Error: the cart for the id:${cartOwnerId} do not exist in the array!!`
    }
  }

  //obtener todos los carritos de la coleccion "carts"
  async getCarts() {
    try {
      return await cartManager.getCarts()
    } catch (error) {
      throw new Error(`Error al realizar getCarts - carts.repository: --> ${error}`)
    }
  }

}

export const cartsRepository = new CartsRepository()