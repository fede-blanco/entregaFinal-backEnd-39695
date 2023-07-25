import mongoose from "mongoose"
import Product from "../models/Product.js";
// import Product from "../models/Product.js";
// import mongoosePaginate from "mongoose-paginate-v2"
import { AddProductError } from "../errors/AddProductError.js";
import { winstonLogger } from "../middlewares/winstonLogger.js";
import productModel from "../models/Product.model.js";

function toPojo(object) {
  return JSON.parse(
    JSON.stringify(
      object
    )
  )
}

class ProductManager {
  collection
  constructor(productModel){
    this.collection = productModel;
  }

  //Funcion que agrega un producto a la coleccion "products"
  async addProduct(product){
    try {
        const creado =  toPojo(await this.collection.create(product))
        winstonLogger.info(`Producto Creado exitosamente ${creado._id}`)
        return creado
    } catch (error) {
      throw new AddProductError(product)
    }
  }
  
  //Funcion que elimina un producto a la coleccion "products"
  async deleteProduct(productId) {
    try {
        const encontrado = await this.collection.deleteOne({_id: productId}).lean()
        winstonLogger.info(`Producto eliminado exitosamente ${productId}`)
        return encontrado
    } catch (error) {
      winstonLogger.error(
        `Error: the product whith the id:${productId} do not exist in the array to delete it - ProductManager.js`
      )
      throw new Error(
        `Error: the product whith the id:${productId} do not exist in the array to delete it - ProductManager.js`
      )
    }
  }

  //Funcion que obtiene la lista ed productos de la coleccion "products"
  async getProducts(options) {
    try {
      const queryFilter = {}

      //aplico filto de caregoria o disponibilidad si se proporciona
      // si hay alguna option.query entra en el if
      if(options.query){
        // si query es "available"
        if (options.query === "available") {
          queryFilter.stock = { $gt: 0}
        } else if (options.query === "Cars" || options.query === "Kitchen" || options.query === "Home"){
          queryFilter.category = options.query
        }
      }

      const sort = {}

      //Aplicamos ordenamiento de precio si es proporcionado
      if(options.sort){
        if(options.sort === "asc") {
          sort.price = 1
        } else if (options.sort === "desc") {
          sort.price = -1
        }
      }

      const limit = options.limit || 10
      const page = options.page || 1

      //se busca los productos en la base de datos enviando como parametros de busqueda lo queries
      const result = await this.collection.paginate(queryFilter,{
        sort,
        limit,
        page,
        lean:true,
      })

      // Se crea un objeto con un formato especifico para devolver y luego utilizar en el front
      const objectToReturn = {
        docs: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${options.url}?page=${result.prevPage}&limit=${limit}&sort=${options.sort}`
          : null,
        nextLink: result.hasNextPage
          ? `${options.url}?page=${result.nextPage}&limit=${limit}&sort=${options.sort}`
          : null,
      }

      return objectToReturn;
      
    } catch (error) {
      winstonLogger.error(`Error al realizar getProducts en el productManager: ${error}`)
      throw new Error(`Error al realizar getProducts en el productManager: ${error}`)
    }
  }

  //Funcion que busca un producto en la base de datos mediante su id
  async getProductById(productId){
    try {
      return await this.collection.findOne({_id: productId}).lean()
    } catch (error) {
      winstonLogger.error(
        `Error: the product whith the id:${productId} do not exist in the array!!`
      )
      throw new Error(
        `Error: the product whith the id:${productId} do not exist in the array!!`
      )
    }
  }

  //Funcion que modifica un producto existente en la coleccion "products"
  async updateProductById(productId, newProperties){
    try {
      const searchedProduct = await this.collection.findOne({_id: productId})

      if (!searchedProduct) {
        winstonLogger.error(
          `Error: the product whith de id:${productId} do not exist in the array`
        )
        throw new Error(
          `Error: the product whith de id:${productId} do not exist in the array`
        )
      }

      //se crea un producto nuevo con las propiedades modificadas
      const updatedProduct = {
        title: newProperties.title || searchedProduct.title,
        description: newProperties.description || searchedProduct.description,
        price: newProperties.price || searchedProduct.price,
        thumbnails: newProperties.thumbnail || searchedProduct.thumbnail,
        stock: newProperties.stock || searchedProduct.stock,
        category: newProperties.category || searchedProduct.category,
        code: newProperties.code || searchedProduct.code,
        status: newProperties.status !== undefined ? newProperties.status : searchedProduct.status,
      }

      await this.collection.updateOne({_id: productId}, updatedProduct).lean()

      winstonLogger.info(`Producto modificado exitosamente ${productId}`)
      return updatedProduct;
      //updateOne no reemplaza completamente el documento como lo hace replaceOne, sino que solo actualiza los campos que se especifican en updatedProduct

    } catch (error) {
      winstonLogger.error(
        `Error: the product whith de id:${productId} do not exist in the array!!! -- productManager.js`
      )
      throw new Error(
        `Error: the product whith de id:${productId} do not exist in the array!!!`
      )
    }
  }
}

//Se exporta Manager de persistencia de productos
export const productManager = new ProductManager(productModel)