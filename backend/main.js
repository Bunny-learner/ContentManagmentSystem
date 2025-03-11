import {connectmongodb} from "./db/dbconnection.js"
import app from "./index.js"
connectmongodb()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`App listening at port ${process.env.PORT}`)
    })
}
)
.catch((error)=>{
    console.error({meassage:"MONGODB connection failed",error})
}
)
