import { HTTP_STATUS } from "../../consts/http-status.mjs"
import Stars from "./model.mjs"
import { validateStarItemInCollection,validateUnStarItemInCollection } from './validator.mjs'
export async function StarItemInCollection(req,res){
    try{
        const { id } = req.user
        const isInvalid=await validateStarItemInCollection(req.body,id)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const { id_collection } = req.body
        const {dataValues:star}=await Stars.create({
            id_user:id,
            id_games_collection:id_collection
        })
        return res.status(HTTP_STATUS.OK).json(star)
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function UnStarItemInCollection(req,res){
    try{
        const { id } = req.user
        const isInvalid=await validateUnStarItemInCollection(req.body,id)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const { id_collection } = req.body
        await Stars.destroy({
            where:{
                id_user:id,
                id_games_collection:id_collection
            }
        })
        return res.status(HTTP_STATUS.OK).json({msg:"Unstared"})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}