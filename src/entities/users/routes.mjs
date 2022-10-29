import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { upload } from "../../utils/image.mjs";
import {CreateUser,AuthUser, UpdateUser,DeleteUser} from './controller.mjs'
let RouterUsers=Router()
RouterUsers.post('/',upload.single('img'),CreateUser);
RouterUsers.post('/auth',AuthUser);
RouterUsers.put('/',verifyToken,upload.single('img'),UpdateUser);
RouterUsers.delete('/',verifyToken,upload.single('img'),DeleteUser);
export default RouterUsers;