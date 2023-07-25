import resetTokensModel from "../models/ResetTokens.model.js"

class ResetTokensManager {
    constructor(resetTokensModel) {
        this.collection = resetTokensModel
    }

    // crea un token y lo agrega a la colección
    async addResetToken(resetToken) {
        try {
            return await this.collection.create(resetToken)
        } catch (error) {
            throw new Error(`Error en addResetToken - TicketManager.js --> ${error}`)
        }
    }

    // obtiene un token mediante el id de usuario
    async getResetTokenByUserId(userId){
        try {
        return await this.collection.findOne({ userId: userId}).lean()
        } catch (error) {
        throw new Error(`Error en getResetTokenByUserId - TicketManager.js --> ${error}`)
        }
    } 
}

export const resetTokenManager = new ResetTokensManager(resetTokensModel)