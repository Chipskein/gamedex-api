import { HTTP_STATUS } from "../../consts/http-status.mjs"
import Games from "./model.mjs"
import { validateCreateGame } from "./validator.mjs"

export async function CreateGame(req,res){
    try{
        const isInvalid=await validateCreateGame(req.body)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const { id:id_user } = req.user
        const {name,publisher} =req.body
        const { dataValues:game}=await Games.create({name,publisher,id_user})
        return res.status(HTTP_STATUS.OK).json(game)
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}