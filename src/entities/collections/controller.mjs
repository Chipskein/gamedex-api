import { HTTP_STATUS } from "../../consts/http-status.mjs"
import { processEvidenceImage } from "../../utils/image.mjs"
import Games from "../games/model.mjs"
import Stars from "../stars/model.mjs"
import Collections from "./model.mjs"
import { rm } from 'fs/promises'
import { validateAddToCollection, validateEvidenceImg, validateGetCollection, validateDeleteItem } from "./validator.mjs"

export async function AddToCollection(req,res){
    const body=JSON.parse(JSON.stringify(req.body))
    const file=req.file
    try{
        const InvalidBody=await validateAddToCollection(body)
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
                message:"Game Doesn't exists"
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
        console.log(err)
        if(file) await rm(file.path)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}

export async function DeleteItem(req,res){
    const { id } = req.params;
    try{
        const InvalidBody=await validateDeleteItem({ id: id })
        if(InvalidBody){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:InvalidBody.details[0].message
            }
        }

        const { id: id_user } = req.user
        // const { id } = body
        const itemExists=await Collections.findOne({
            where: { id, id_user }
        })

        if(!itemExists){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:"Item Doesn't exists"
            }
        }
        
        const resData = await Collections.destroy({
            where: { id: id }
        })
        return res.status(HTTP_STATUS.OK).json(resData)
    }
    catch(err){
        console.log(err)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}

export async function GetCollection(req,res){
    try{
        const isInvalid=validateGetCollection(req.query)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        let {limit,offset, id}=req.query;
        if(!limit) limit=10;
        if(!offset) offset=0;
        limit=Number(limit)
        offset=Number(offset)
        let idUser = id ? id : req.user.id;
        const games=[];
        const {rows,count} = await Games.findAndCountAll({ 
            include: [{
                model: Collections,
                required: true,
                where: {
                    id_user: idUser
                }
            }],
            limit,
            offset
        })
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
        return res.status(HTTP_STATUS.OK).json({rows:games,limit,offset,count})
    }
    catch(err){
        console.log(err)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
