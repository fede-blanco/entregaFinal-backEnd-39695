import Cart from "../models/Cart.js";
import cartModel from "../models/Cart.model.js";

//Manager de productos
class CartManager {
    cartModel
  constructor(cartModel){
    this.collection = cartModel
  }

  //Funcion que obtiene los productos de la base de datos
  async getCarts(){
    try {
      const carts = await this.collection.find().populate('products.product').lean()
      return carts
    } catch (error) {
      throw new Error(`Error al realizar getCarts - CartManager.js: ${error}`)
    }
  }
  //Funcion que obtiene un producto de la base de datos mediante su id
  async getCartById(cartId){
    try {
      const searchedCart = await this.collection.findOne({_id: cartId}).populate('products.product').lean()
      return searchedCart
    } catch (error) {
      throw new Error(
        `Error: the product whith the id:${cartId} do not exist in the array!!`
      )
    }
  }

  //Funcion que obtiene un producto de la base de datos mediante su id
  async getCartByOwnerId(cartOwnerId){
    try {
      const searchedCart = await this.collection.findOne({cartOwner: cartOwnerId}).populate([
        { path: 'products.product' },
        {path: 'cartOwner' }
      ]).lean()
      return searchedCart
    } catch (error) {
      throw new Error(
        `Error: the cart for the the id:${cartOwnerId} do not exist in the array!!`
      )
    }
  }

  //Funcion que agrega un carrito nuevo a la coleccion de carritos
  async addCart(cartOwnerId){
    try {
      const newCartToAdd = new Cart(cartOwnerId)
      return await this.collection.create(newCartToAdd)
    } catch (error) {
      throw new Error("Error al realizar addCart - CartManager.js")
    }
  }

  //Funcion que agrega un producto al carrito
  async addProdToCart(cartId, productId) {
    try {
      const cart = await this.collection.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }).populate('products.product');
      if (cart) {
        return cart;
      }
      const newCart = await this.collection.findOneAndUpdate(
        { _id: cartId },
        { $push: { products: { product: productId, quantity: 1 } } },
        { new: true }
      ).populate('products.product');
      return newCart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito - CartManager.js: ${error}`);
    }
  }

  //Funcion que agrega varios productos al carrito simultaneamente meadiante un array de productos
  async updateCartProducts (cartId, productsArray) {
    try {
      const updatedCart = await this.collection.findOneAndUpdate(
      { _id: cartId },
      { $push: { products: productsArray } },
      { new: true }
    ).populate('products.product');
      
    return updatedCart;

    } catch (error) {
      throw new Error(`Error al agregar array de productos a lcarrito - CartManager.js: ${error}`);
    }
  }

  //Funcion que agrega un producto a un carrito mediante su id y el del carro. si ya existe, solo modifica su cantidad
  async updateCartProductById (cartId, productId, quantity) {
    try {
      const updatedCart = await this.collection.findOneAndUpdate(
        {_id: cartId , "products.product": productId },
        {$set: {"products.$.quantity": quantity}},
        {new: true}
      ).populate('products.product')
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al modificar la cantidad de un producto del carrito - CartManager.js: ${error}`);
    }

  }

  //Funcion que elimina todas las existencias de un producto del carrito
  async deleteFullProductFromCart (cartId, productId) {
    try {
     
      //modifica un elemento y elimina el producto que tenga el id del producto en "product"
      const updatedCart = await this.collection.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: productId} } },
      { new: true } //indicar que se debe devolver el documento actualizado en lugar del documento original.
      ).populate('products.product');

      return updatedCart;
    } catch (error) {
      throw new Error(`Error al eliminar producto al carrito - deleteFullProductFromCart - CartManager.js: ${error}`);
    }
  }

  //Funcion que elimina una existencia del producto y si llega a 0 existencias lo elimina por completo
  async deleteProdFromCart(cartId, productId) {
    try {
      const cart = await this.collection.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $inc: { "products.$[elem].quantity": -1 } },
        { new: true, arrayFilters: [{"elem.product": productId}] }).populate('products.product');
        if (!cart) {
          throw new Error(`El carrito no fue encontrado en deleteProdFromCart - cartManager.js ${error}`)
        }

      // Remove products with quantity 0
      const updatedCart = await this.collection.findOneAndUpdate(
      { _id: cartId },
      { $pull: { products: { product: productId, quantity: 0 } } },
      { new: true }
      ).populate('products.product');
      
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al eliminar producto al carrito - CartManager.js: ${error}`);
    }
  }
  
  //Funcion que elimina todos los productos de un carrito
  async deleteAllCartProducts (cartId) {
    try {
      
      const cartWithNoProducts = await this.collection.findOneAndUpdate(
        {_id: cartId},
        {$set: { products: []}},
        {new: true}
      ).populate('products.product')

      return cartWithNoProducts

    } catch (error) {
      throw new Error(`Error al eliminar todos los productos del carrito - CartManager.js: ${error}`);
    }
  }
}

//Se exporta Manager de persistencia de carritos
export const cartManager = new CartManager(cartModel)