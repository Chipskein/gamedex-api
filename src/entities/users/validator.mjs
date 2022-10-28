import Joi from "joi";
import Users from "./model.mjs";

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
});
const authUserSchema= Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
});

export async function validateUser(user){
    const validacao = userSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }

    const userExists = await Users.findOne({where:{email:user.email}})
    if(userExists){
        return { details:[{message:"User Already Exists"}]}
    }

}
export async function validateAuthUser(user){
    const validacao = authUserSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }
    const userExists = await Users.findOne({where:{email:user.email}})
    if(!userExists){
        return { details:[{message:"User don't Exists"}]}
    }

}

