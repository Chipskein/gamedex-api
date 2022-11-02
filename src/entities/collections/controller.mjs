import { HTTP_STATUS } from "../../consts/http-status.mjs"
import Games from "./model.mjs"
import Collections from "./model.mjs"

export async function AddToCollection(req,res){
    try{
        console.log(req.body);
        console.log(req.file);
        return res.status(HTTP_STATUS.OK).json({msg:''})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
