import Joi from "joi";
import Games from "./model.mjs";


const gameSchema = Joi.object({
    name:Joi.string().required(),
    publisher:Joi.string().required(),
});

export async function validateCreateGame(game){
    const validacao = gameSchema.validate(game, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
    const gameExists = await Games.findOne({where:{name:game.name}})
    if(gameExists){
        return { details:[{message:"Game Already Exists"}]}
    }
}