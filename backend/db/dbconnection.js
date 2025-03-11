import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
const connectmongodb=async()=>{
    try {
        console.log("started connecting to mongodb")
        await mongoose.connect(`${process.env.database_url}`,{
             useNewUrlParser: true,
            useUnifiedTopology: true})
        console.log("MONGODB connected sucessfully")
    } catch (error) {
        console.error("MONGODB connection failed: ",error)
        process.exit(1)
    }
}

export  {connectmongodb}
