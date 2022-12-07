import  { Router } from  "express";
import { verifyToken } from "../../middlewares/auth.mjs";
import { isDataMaster } from "../../middlewares/perms.mjs";
import { CreateGame,GetGames } from './controller.mjs'
import { upload } from "../../utils/image.mjs";

let RouterGames=Router()
RouterGames.post('/', verifyToken, isDataMaster, upload.single('game_img'), CreateGame);
RouterGames.get('/', verifyToken, GetGames);

export default RouterGames;