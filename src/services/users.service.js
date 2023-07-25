import { winstonLogger } from "../middlewares/winstonLogger.js";
import ResetToken from "../models/ResetToken.js";
import { resetTokensRepository } from "../repositories/resetTokens.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
import { createHash, desencriptarJWT, encriptarJWT,  isValidHash } from "../utils.js";
import { emailService } from "./email.service.js";

class UserService {


    async addUser(user){
      try {
        let usercreated = await usersRepository.addUser(user);
        winstonLogger.info(`Usuario creado -- - ${new Date().toLocaleTimeString()}`)
        return usercreated
      } catch (error) {
        winstonLogger.error(`Error en assUser - user.service.js --> ${error}`)
        throw new Error(`Error en assUser - user.service.js --> ${error}`)
      }
    }
    
    async getUserByEmail(email){
      try {
        return await usersRepository.getUserByEmail(email);
      } catch (error) {
        winstonLogger.error(`Error en getUserByEmail - user.service.js --> ${error}`)
        throw new Error(`Error en getUserByEmail - user.service.js --> ${error}`)
      }
    }
    async getUserById(userId){
      try {
        const user = await usersRepository.getUserById(userId);
        return user
      } catch (error) {
        winstonLogger.error(`Error en getUserById - user.service.js --> ${error}`)
        throw new Error(`Error en getUserById - user.service.js --> ${error}`)
      }
    }
    
    async getUsers(){
      try {
        return await usersRepository.getUsers();
      } catch (error) {
        winstonLogger.error(`Error en getUsers - user.service.js --> ${error}`)
        throw new Error(`Error en getUsers - user.service.js --> ${error}`)
      }
    }

    async updateUserById(userId, userUpdated){
        try {
            return await usersRepository.updateUserById(userId, userUpdated)
        } catch (error) {
            winstonLogger.error(`Error en updateUserById - user.service.js --> ${error}`)
            throw new Error(`Error en updateUserById - user.service.js --> ${error}`)
        }
    }


    // Funcion que genera token para actualizar contraseña y lo envia por mail al mail ingresado
    // hay que ver como recive el parametro, si se le pasara solo el id o el req.body entero por lo cual habra que destructurar la propeidad
    async obtainTokenForPassUpdate(userId){ 
        const user = await usersService.getUserById(userId)
        const idUser = user._id
        // Generamos un token de algun dato del usuario y modificamos la funcion de encriptacion para poder pasarle un tiempo de expiracion por parametro
        const token = encriptarJWT({userId}, "1h")
        const resetToken = new ResetToken({userId, token})
        const addedResetToken = await resetTokensRepository.addResetToken(resetToken)
        
        const resetPasswordUrl = `http://localhost:8080/resetPasswordForm?token=${token}&email=${user.email}`
        
        const mailEnviado = await emailService.sendPasswordReset(user.email, "Reestablecimiento de contraseña", resetPasswordUrl )

        return addedResetToken
    }

    async updateUserPassword(userId, password, token){

        let resetToken;
        // Validacion que se fija que exista el token en la base de datos
        try {
            resetToken = await resetTokensRepository.getResetTokenByUserId(userId)
        } catch (error) {
            throw new Error (`pedido invalido: no tiene autorizacion para reestablecer la contraseña - 1`)   
        }
        
        // Me fijo si esta expirado tratando de desencriptar el token. Si falla al hacer la desencriptacion correcta es porque esta expirado
        try {
            desencriptarJWT(token)
        } catch (error) {
            this.obtainTokenForPassUpdate(userId)
        }

        // Comparo los tokens (el q memandaron y el que tengo guardado)
        if ( token !== resetToken.token) {
            throw new Error (`pedido invalido: no tiene autorizacion para reestablecer la contraseña - 3`)
        }
        const previousUser = await usersService.getUserById(userId)
        if(isValidHash(password, previousUser.password)){
            throw new Error(`La password nueva debe ser diferente a la existente`)
        }

        const hashedPass = createHash(password)
        const actualizations = {password: hashedPass}
        const updatedUser = await usersRepository.updateUserById(userId, actualizations)
        return updatedUser
    }

    // Eliminar usuario - funciona
    async deleteUserById(userId) {
        try {
        return await usersRepository.deleteUserById(userId)
        } catch (error) {
        throw new Error(
            `Error: the user whith the id:${userId} do not exist in the array to delete it - users.service.js`
        )
        }
    }
}
export const usersService = new UserService()