import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { upload } from "../../utils/image.mjs";
import {  GetCollection, AddToCollection, DeleteItem } from './controller.mjs'
let RouterCollection=Router()

RouterCollection.post('/',verifyToken, upload.single('evidence_img'), AddToCollection);
RouterCollection.delete('/:id/delete',verifyToken, DeleteItem);
RouterCollection.get('/',verifyToken,GetCollection);

export default RouterCollection;