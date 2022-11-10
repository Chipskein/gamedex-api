import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { StarItemInCollection } from './controller.mjs'
let RouterStars=Router()
RouterStars.post('/',verifyToken,StarItemInCollection);
export default RouterStars;