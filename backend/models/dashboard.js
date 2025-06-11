import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const schema1=new mongoose.Schema({
username:{
    type:String,
    required:true
},
status:{
    type:String,
    required:true
},
role:{
       type:String,
    required:true,
    default:"viewer"
},
time:{
       type:String,
    required:true
}
},{timestamps:true})


export const dash= mongoose.model("admin_dashborad", schema1)


