import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { StarItemInCollection,UnStarItemInCollection } from './controller.mjs'
let RouterStars=Router()
RouterStars.post('/',verifyToken,StarItemInCollection);
RouterStars.post('/delete',verifyToken,UnStarItemInCollection);
export default RouterStars;