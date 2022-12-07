import { HTTP_STATUS } from "../../consts/http-status.mjs"
import Games from "./model.mjs"
import Collections from "../collections/model.mjs"
import Stars from "../stars/model.mjs"
import { validateCreateGame,validateGetGames} from "./validator.mjs"
import { Sequelize,fn,col } from "sequelize"
import { validateEvidenceImg } from "../collections/validator.mjs"
import { processEvidenceImage } from "../../utils/image.mjs"

export async function CreateGame(req,res){
    try{
        const isInvalid=await validateCreateGame(req.body)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const file = req.file;

        const InvalidFile = validateEvidenceImg(file)
        if(InvalidFile){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:InvalidFile.details[0].message
            }
        }
        
        const game_img = await processEvidenceImage(file, true)
        const { id: id_user } = req.user
        const { name, publisher, genre } = req.body
        const { dataValues: game } = await Games.create({ name, publisher, id_user, genre, img: game_img })
        return res.status(HTTP_STATUS.OK).json(game)
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function GetGames(req,res){
    try{
        const { id:id_user } =req.user
        const isInvalid=validateGetGames(req.query)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        let {filter,search,limit,offset}=req.query;
        if(!filter) filter="all";
        if(!search) search="";
        if(!limit) limit=10;
        if(!offset) offset=0;
        limit=Number(limit)
        offset=Number(offset)

        const Op = Sequelize.Op;
        const query = `%${search}%`;

        const {count,rows}=await Games.findAndCountAll({
            where: {name: { [Op.iLike]: query }},
            include: [{
                model: Collections,
                where:{id_user},
                required: false,
            }],
            limit,offset
        })
        const games=[];
        await Promise.all(
            rows.map( async ({dataValues:game})=>{
                const {count:stars_qt}=await Collections.findAndCountAll(
                    {
                        where:{
                            id_game:game.id
                        },
                        include:{
                            model:Stars,
                            required:true
                        }
                    }
                )
                games.push({...game,stars_qt})
            })
        );
        return res.status(HTTP_STATUS.OK).json({count,limit,offset,games})
    }
    catch(err){
        console.log(err)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}