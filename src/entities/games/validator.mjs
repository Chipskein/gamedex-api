import Joi from "joi";
import Games from "./model.mjs";


const gameSchema = Joi.object({
    name:Joi.string().required(),
    publisher:Joi.string().required(),
});

const GetGamesSchema = Joi.object({
    limit:Joi.number(),
    offset:Joi.number()
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
export function validateGetGames(query){
    const validacao = GetGamesSchema.validate(query, {
        abortEarly: false
    });
    if (validacao.error) {
        return validacao.error;
    }
}
