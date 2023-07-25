import { winstonLogger } from "../middlewares/winstonLogger.js"
import productModel from "../models/Product.model.js";
import userModel from "../models/Users.model.js"

class UserManager {
  constructor(model) {
    this.collection = model
  }

  async addUser(user) {
    try {
        let usercreated = await this.collection.create(user)
        return usercreated;
    } catch (error) {
      winstonLogger.error(`Error en addUser - UserManager.js --> ${error}`)
      throw new Error(`Error en addUser - UserManager.js --> ${error}`)
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.collection.findOne({ email: email }).lean()
    } catch (error) {
      throw new Error(`Error en getUserByEmail - UserManager.js --> ${error}`)
    }
  }

  async getUserById(userId) {
    try {
      const user =  await this.collection.findOne({ _id: userId }).lean()
      return user;
    } catch (error) {
      throw new Error(`Error en getUserById- UserManager.js --> ${error}`)
    }
  }

  async getUsers() {
    try {
      return await this.collection.find().lean()
    } catch (error) {
      throw new Error(`Error en getUsers - UserManager.js --> ${error}`)
    }
  }

  async updateUserById(userId, userUpdated){
    try {
        const searchedUser = await this.collection.findOne({_id: userId})
        if (!searchedUser) {
            winstonLogger.error(
              `Error: the product whith de id:${productId} do not exist in the array`
            )
            throw new Error(
              `Error: the product whith de id:${productId} do not exist in the array`
            )
          }

          const user = await this.collection.updateOne({_id: userId}, userUpdated).lean()

          const updatedUser = await this.collection.findOne({ _id: userId}).lean()

          return updatedUser
    } catch (error) {
        winstonLogger.error(
            `Error: the product whith de id:${userId} do not exist in the array!!! -- userManager.js`
          )
          throw new Error(
            `Error: the product whith de id:${userId} do not exist in the array!!!`
          )
    }
  }

    //Funcion que elimina un usuario a la coleccion "products"
    async deleteUserById(userId) {
        try {
            const encontrado = await this.collection.deleteOne({_id: userId}).lean()
            await productModel.deleteMany({owner: userId})
            winstonLogger.info(`Usuario eliminado exitosamente ${userId}`)
            winstonLogger.info(`Productos asociados a ${userId} eliminados exitosamente`)
            return encontrado
        } catch (error) {
          winstonLogger.error(
            `Error: the user whith the id:${userId} do not exist in the array to delete it - UserManager.js`
          )
          throw new Error(
            `Error: the user whith the id:${userId} do not exist in the array to delete it - UserManager.js`
          )
        }
      }
}

export const userManager = new UserManager(userModel)
