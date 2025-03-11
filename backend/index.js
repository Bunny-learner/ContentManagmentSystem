import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
const app=express()



app.use(express.static("public"));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs')



import router1 from "./routes/cities.js"
app.use('/',router1)


export default app