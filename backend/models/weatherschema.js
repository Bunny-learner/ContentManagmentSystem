import mongoose,{model, Schema} from 'mongoose'
import jwt from 'jsonwebtoken'

const weatherschema=new Schema({

})

export const weathermodel=new mongoose.model('weatherdata',weatherschema)

