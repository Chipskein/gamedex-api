import { HTTP_STATUS } from "../../consts/http-status.mjs"
import { processEvidenceImage } from "../../utils/image.mjs"
import Games from "../games/model.mjs"
import Collections from "./model.mjs"
import { validateAddToCollection, validateEvidenceImg } from "./validator.mjs"
export async function AddToCollection(req,res){
    try{
        const body=JSON.parse(JSON.stringify(req.body))
        const file=req.file
        const InvalidBody=validateAddToCollection(body)
        if(InvalidBody){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:InvalidBody.details[0].message
            }
        }
        const InvalidFile=validateEvidenceImg(file)
        if(InvalidFile){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:InvalidFile.details[0].message
            }
        }
        const { id:id_user } =req.user
        const { id_game } = body
        const gameExists=await Games.findByPk(id_game)
        if(!gameExists){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Game Don't exists"
            }
        }
        const evidence_img=await processEvidenceImage(file)
        const {dataValues:item_collection}=await Collections.create({
            id_game,
            id_user,
            evidence_img
        })
        return res.status(HTTP_STATUS.OK).json(item_collection)
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
