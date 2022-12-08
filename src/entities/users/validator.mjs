import Joi from "joi";
import Users from "./model.mjs";

const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required(),
});
const authUserSchema= Joi.object({
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().email().required(),
});
const updateUserSchema= Joi.object({
    password: Joi.string().allow(null,false).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    name: Joi.string().allow(null,false).max(30),
});
const GetUserSchema= Joi.object({
    id:Joi.number().required()
});
const GetUsersSchema= Joi.object({
    limit:Joi.number(),
    offset:Joi.number(),
    search:Joi.string()
});
const SearchUsersSchema= Joi.object({
    search:Joi.string().required(),
    limit:Joi.number(),
    offset:Joi.number()
});

export async function validateUser(user){
    const validacao = userSchema.validate(user, {
        abortEarly: false
    });

    if (validacao.error) {
        return validacao.error;
    }

    const userExists = await Users.findOne({where:{email:user.email,active:true}})
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
    const userExists = await Users.findOne({where:{email:user.email,active:true}})
    if(!userExists){
        return { details:[{message:"User don't Exists"}]}
    }

}
export async function validateUpdateUser(user,email){
    const validacao = updateUserSchema.validate(user, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
    const userExists = await Users.findOne({where:{email,active:true}})
    if(!userExists){
        return { details:[{message:"User don't Exists"}]}
    }
}
export async function validateGetUser(user){
    const validacao = GetUserSchema.validate(user, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
    const userExists = await Users.findOne({where:{id:user.id,active:true}})
    if(!userExists){
        return { details:[{message:"User don't Exists"}]}
    }
}

export async function validateGetUsers(user){
    const validacao = GetUsersSchema.validate(user, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
}


export async function validateSearchUsers(user){
    const validacao = SearchUsersSchema.validate(user, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
}


