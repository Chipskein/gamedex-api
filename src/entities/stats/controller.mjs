import { HTTP_STATUS } from "../../consts/http-status.mjs";
import { testing } from "./dao.mjs";


export async function GetMoreStaredItems(req,res){
    try{
        const data={items:[],}
        console.log(await testing())
        return res.status(HTTP_STATUS.OK).json(data)
    }
    catch(err){
        console.log(err)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function GetUsersWithMostItems(req,res){
    try{
        const data={users:[]}
        return res.status(HTTP_STATUS.OK).json(data)
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function GetMorePossesedItems(req,res){
    try{
        const data={items:[]}
        return res.status(HTTP_STATUS.OK).json(data)
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}