 import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const postschema=new mongoose.Schema({
username:{
    type:String,
    required:true
},
title:{
type:String,
required:true,
},
description:{
    type:String,
    required:true,
    default:"this is the description of the post"
},
urls:{
    type:Array,
    deafult:[]
},
content:{
    type:Object,
    required:true
},
status:{
    type:String,
    default:"draft" // draft, published, archived
}},{timestamps:true})


export const posts= mongoose.model("posts", postschema)


