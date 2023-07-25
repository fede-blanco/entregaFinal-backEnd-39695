import { resetTokenManager } from "../managers/ResetTokenManager.js";

class ResetTokensRepository {

    async addResetToken(resetToken){
        try {
            const addedResetToken = await resetTokenManager.addResetToken(resetToken)
            return addedResetToken
        } catch (error) {
            throw new Error(`Error en addResetToken - resetTokens.repository.js -- ${error}`);
        }
    }

    async getResetTokenByUserId(userId){
        try {
            const resetTokenFound = await resetTokenManager.getResetTokenByUserId(userId);
            return resetTokenFound;
        } catch (error) {
            throw new Error(`Error en getResetTokenByUserId -- resetTokens.repository.js ---> ${error}`)
        }
      }
}

export const resetTokensRepository = new ResetTokensRepository()