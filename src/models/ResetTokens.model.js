import mongoose from 'mongoose'

const collection = 'resetTokens'

const schema = new mongoose.Schema({
    userId: {type: String, required: true},
    token: {type: String, required: true}
}, {versionKey: false})

const resetTokensModel = mongoose.model(collection, schema)

export default resetTokensModel