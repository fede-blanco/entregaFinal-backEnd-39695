import { userManager } from "../managers/UserManager.js";

class UserRepository {

    async addUser(user){
      try {
        let usercreated = await userManager.addUser(user);
        return usercreated
      } catch (error) {
        throw new Error(`Error en assUser - user.repository.js --> ${error}`)
      }
    }
    
    async getUserByEmail(email){
      try {
        return await userManager.getUserByEmail(email);
      } catch (error) {
        throw new Error(`Error en getUserByEmail - user.repository.js --> ${error}`)
      }
    }

    async getUserById(userId){
      try {
        return await userManager.getUserById(userId);
      } catch (error) {
        throw new Error(`Error en getUserById - user.repository.js --> ${error}`)
      }
    }
    
    async getUsers(){
      try {
        return await userManager.getUsers();
      } catch (error) {
        throw new Error(`Error en getUsers - user.repository.js --> ${error}`)
      }
    }

    async updateUserById(userId, userUpdated){
        try {
            return await userManager.updateUserById(userId, userUpdated)
        } catch (error) {
            throw new Error(`Error en updateUserById - user.repository.js --> ${error}`)
        }
    }

    // Eliminar usuario - funciona
    async deleteUserById(userId) {
        try {
        return await userManager.deleteUserById(userId)
        } catch (error) {
        throw new Error(
            `Error: the user whith the id:${userId} do not exist in the array to delete it - user.repository.js`
        )
        }
    }

}

export const usersRepository = new UserRepository()