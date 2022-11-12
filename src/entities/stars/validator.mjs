import Joi from "joi";
import Collections from '../collections/model.mjs'
import Stars from './model.mjs'
const StarItemInCollectionSchema = Joi.object({
    id_collection:Joi.number().required(),
});


export async function validateStarItemInCollection(body,userId){
    const validacao = StarItemInCollectionSchema.validate(body, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
    const VerifyIfItemExists = await Collections.findOne({where:{id:body.id_collection}})
    if(!VerifyIfItemExists){
        return { details:[{message:"Item doesn't exists"}]}
    }
    const VerifyIfHasAlreadyStared=await Stars.findOne({
        where:{
            id_games_collection:body.id_collection,
            id_user:userId
        }}
    )
    if(VerifyIfHasAlreadyStared){
        return { details:[{message:"Already stared"}]}
    }
    
    
}
export async function validateUnStarItemInCollection(body,userId){
    const validacao = StarItemInCollectionSchema.validate(body, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
    const VerifyIfItemExists = await Collections.findOne({where:{id:body.id_collection}})
    if(!VerifyIfItemExists){
        return { details:[{message:"Item doesn't exists"}]}
    }
    const VerifyIfHasAlreadyStared=await Stars.findOne({
        where:{
            id_games_collection:body.id_collection,
            id_user:userId
        }}
    )
    if(!VerifyIfHasAlreadyStared){
        return { details:[{message:"Don't stared yet"}]}
    }
    
    
}
