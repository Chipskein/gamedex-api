import Joi from "joi";
import Collections from '../collections/model.mjs'

const StarItemInCollectionSchema = Joi.object({
    id_collection:Joi.number().required(),
});


export async function validateStarItemInCollection(body){
    const validacao = StarItemInCollectionSchema.validate(body, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
    const VerifiyIfItemExists = await Collections.findOne({where:{id:body.id_collection}})
    if(!VerifiyIfItemExists){
        return { details:[{message:"Item doesn't exists"}]}
    }
}

