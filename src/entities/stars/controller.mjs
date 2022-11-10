import { HTTP_STATUS } from "../../consts/http-status.mjs"
export async function StarItemInCollection(req,res){
    try{
           //throw {
            //    status:HTTP_STATUS.BAD_REQUEST,
            //    message:isInvalid.details[0].message
            //}
        return res.status(statusCode).json({ msg: "eaiman"})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}