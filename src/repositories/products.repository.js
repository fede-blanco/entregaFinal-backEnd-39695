import { productManager } from "../managers/ProductManager.js";

//Capa de "services" para utilizar como intermediario entre la logica de negocio y el acceso a la base de datos para su proteccion

class ProductsRepository {

  // Agrega producto - funciona
  async addProduct(product) {
    try {
      const prodAdded = await productManager.addProduct(product);
      return prodAdded
    } catch (error) {
      throw new Error(`Error en addProduct - products.repository.js + ${error}`)
    }
  }
  
  // actualiza producto - funciona
  async updateProduct(productId, newProperties){
    try {
      return await productManager.updateProductById(productId, newProperties)
      
    } catch (error) {
      throw new Error(`Error en updatetProduct - products.repository.js + ${error}`)
      
    }
  }

  // Eliminar producto - funciona
  async deleteProduct(productId) {
    try {
      return await productManager.deleteProduct(productId)
    } catch (error) {
      throw new Error(
        `Error: the product whith the id:${productId} do not exist in the array to delete it - Products.repository.js`
      )
    }
  }

  //Buscar productos
  async getProducts(options){
    try {
      return await productManager.getProducts(options)
    } catch (error) {
      throw new Error(`Error al realizar getProducts: ${error}`)
    }
  }

   //Buscar producto por id
   async getProductById(productId){
     try {
       return await productManager.getProductById(productId)
     } catch (error) {
       throw new Error(
         `Error: the product whith the id:${productId} do not exist in the array!!`
       )
     }
   }
}

export const productsRepository = new ProductsRepository()