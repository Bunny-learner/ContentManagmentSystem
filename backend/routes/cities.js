import {Router} from "express"
import {citiesdata} from "../controllers/usercontrollers.js"

const router1=Router()


router1.get('/weather',citiesdata)


export default router1