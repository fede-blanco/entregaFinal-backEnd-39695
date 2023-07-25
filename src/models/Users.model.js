import mongoose from 'mongoose'

const collection = 'users'

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: String,
    last_connection: { type: Date, default: Date.now },
}, {versionKey: false})

const userModel = mongoose.model(collection, schema)

export default userModel