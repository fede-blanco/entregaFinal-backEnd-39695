import mongoose, {Schema} from 'mongoose'
import mongoosePaginate from "mongoose-paginate-v2"

const collection = 'carts'

const schema = new mongoose.Schema({
    cartOwner: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    products: {
        type: [
          {
            product: {
              type: Schema.Types.ObjectId,
              ref: "products"
            },
            quantity: {
              type: Number,
              default: 1
            }
          }
        ],
        default: []
      }
    }, {versionKey: false})

//se integra el plugin de "mongoose-paginate-v2"
schema.plugin(mongoosePaginate)

//Data Acces Object (DAO) o "Model"
const cartModel = mongoose.model(collection, schema)

export default cartModel