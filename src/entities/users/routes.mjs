import  { Router } from  "express";
import { upload } from "../../utils/image.mjs";
import {CreateUser,AuthUser} from './controller.mjs'
let RouterUsers=Router()
RouterUsers.post('/',upload.single('img'),CreateUser);
RouterUsers.post('/auth',AuthUser);
export default RouterUsers;