import Joi from "joi";
import { ValidImageMimeType } from "../../utils/image.mjs";


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

export function validateAddToCollection(request){
    const validacao = AddToCollectionSchema.validate(request, {
        abortEarly: false
    });
    
    if (validacao.error) {
        return validacao.error;
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
