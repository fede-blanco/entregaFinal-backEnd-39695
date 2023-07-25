import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const collection = 'products'

const schema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String,  required: true},
    price: {type: Number,  required: true, index: true}, //index:true (Genera una lista indexada)
    thumbnails: { type: Array, default: []},
    code: {type: String, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    //status inicializa true
    status: {type: Boolean, required: true, default: true},
    owner: {
    type: Schema.Types.ObjectId,
    ref:"users",
    }
}, {versionKey: false})

//se integra el plugin de "mongoose-paginate-v2"
schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema)

export default productModel