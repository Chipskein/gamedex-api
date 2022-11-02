import { HTTP_STATUS } from "../../consts/http-status.mjs"
import Games from "./model.mjs"
import { validateCreateGame,validateGetGames} from "./validator.mjs"

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
export async function GetGames(req,res){
    try{
        const isInvalid=validateGetGames(req.query)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        let {limit,offset}=req.query;
        if(!limit) limit=10;
        if(!offset) offset=0;
        limit=Number(limit)
        offset=Number(offset)
        const {count,rows}=await Games.findAndCountAll({limit,offset})
        const games=[];
        rows.map(({dataValues:game})=>{games.push(game)});
        return res.status(HTTP_STATUS.OK).json({count,limit,offset,games})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}