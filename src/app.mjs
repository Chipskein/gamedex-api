import express from 'express';
import { HTTP_STATUS } from './consts/http-status.mjs';
import path from 'path'
import {fileURLToPath} from 'url';
import {  InitDatabase } from './orm/sequelize.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import usersRoutes from './entities/users/routes.mjs';
import gamesRoutes from './entities/games/routes.mjs';

export async function CreateAppInstace(database){
    await InitDatabase(database)
    const app = express();
    app.use(express.urlencoded({extended:true}));
    app.use(express.json());

    app.use("/users",usersRoutes)
    app.use("/games",gamesRoutes)

    app.get("/",(req,res)=>{
        return res.sendFile(path.join(__dirname,'pages','index.html',))
    })
    app.use("*",(req,res)=>{
        return res.status(HTTP_STATUS.NOT_FOUND).json({msg:"Resource not found"})
    })
    return app;
}