import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { isDataMaster } from "../../middlewares/perms.mjs";
import { CreateGame } from './controller.mjs'
let RouterGames=Router()
RouterGames.post('/',verifyToken,isDataMaster,CreateGame);

export default RouterGames;