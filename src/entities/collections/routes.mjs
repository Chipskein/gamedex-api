import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { upload } from "../../utils/image.mjs";
import {  AddToCollection } from './controller.mjs'
let RouterCollection=Router()
RouterCollection.post('/',verifyToken,upload.single('evidence_img'),AddToCollection);
export default RouterCollection;