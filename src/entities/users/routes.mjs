import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { upload } from "../../utils/image.mjs";
import {CreateUser,AuthUser, UpdateUser,DeleteUser, GetUser, GetUsers, SearchUsers} from './controller.mjs'
let RouterUsers=Router()
RouterUsers.post('/',upload.single('img'),CreateUser);
RouterUsers.post('/auth',AuthUser);
RouterUsers.put('/',verifyToken,upload.single('img'),UpdateUser);
RouterUsers.delete('/',verifyToken,DeleteUser);
RouterUsers.get('/',verifyToken,GetUsers);
RouterUsers.get('/search',verifyToken,SearchUsers);
RouterUsers.get('/:id',verifyToken,GetUser);

export default RouterUsers;