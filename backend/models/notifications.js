import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const schema3=new mongoose.Schema({
from:{
    type:String,
    required:true
},
role:{
       type:String,
        required:true
},
message:{
    title:{
        type:String,
        default:""
    },
    description:{
         type:String,
        default:""
    },
    content:{ 
        type:Object,
        default:""},
    status:{
        type:String,
        default:""
    },
    image:{
        type:String,
        deafult:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/500px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png"
    },
    msg:{
        type:String,
        default:""
    }
},
seen:{
    type:Boolean,
    default:false
},
roomid:{
    type:String,
    default:""
},
to:{
    type:String,
    default:""
}
},{timestamps:true})


export const notifydb= mongoose.model("notifications", schema3)


