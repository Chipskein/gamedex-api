import  { Router } from  "express";
import { upload } from "../../utils/image.mjs";
import {CreateUser} from './controller.mjs'
let RouterUsers=Router()
RouterUsers.post('/',upload.single('img'),CreateUser);
export default RouterUsers;