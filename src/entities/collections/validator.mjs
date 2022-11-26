import Joi from "joi";
import { ValidImageMimeType } from "../../utils/image.mjs";
import Games from "../games/model.mjs";
import Collections from "./model.mjs";

const AddToCollectionSchema = Joi.object({
    id_game:Joi.number().required()
});
const EvidenceImageSchema = Joi.object({
    path:Joi.string().required(),
    mimetype:Joi.string().required(),
    size:Joi.number().required(),
    fieldname: Joi.string().optional(),
    originalname: Joi.string().optional(),
    encoding: Joi.string().optional(),
    destination: Joi.string().optional(),
    filename: Joi.string().optional(),
});
const GetCollectionSchema = Joi.object({
    limit:Joi.number(),
    offset:Joi.number()
});

export async function validateAddToCollection(body){
    const validacao = AddToCollectionSchema.validate(body, {
        abortEarly: false
    });
    
    if (validacao.error) {
        return validacao.error;
    }
    const gameExists = await Games.findByPk(body.id_game)
    if(!gameExists){
        return { details:[{message:"Game Don't exists"}]}
    }
    const gameAlreadyInCollection=await Collections.findOne({where:{id_game:body.id_game}})
    if(gameAlreadyInCollection){
        return { details:[{message:"Game Already in collection"}]}
    }
}

export  function validateEvidenceImg(file){
    const validacao = EvidenceImageSchema.validate(file, {
        abortEarly: false
    });
    if(!ValidImageMimeType(file.mimetype)){
        validacao.error.push({detaiils:{message:"Invalid MimeType"}})
    }
    if (validacao.error) {
        return validacao.error;
    }

}

export function validateGetCollection(query){
    const validacao = GetCollectionSchema.validate(query, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
}
