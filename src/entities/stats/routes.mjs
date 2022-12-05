import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { GetMorePossesedItems,GetMoreStaredItems,GetUsersWithMostItems } from './controller.mjs'
let RouterStats=Router()
RouterStats.get('/users-most-items',verifyToken,GetUsersWithMostItems);
RouterStats.get('/more-possesed-items',verifyToken,GetMorePossesedItems);
RouterStats.get('/more-stared-items',verifyToken,GetMoreStaredItems);
export default RouterStats;