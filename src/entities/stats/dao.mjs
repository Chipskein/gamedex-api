import { QueryTypes } from "sequelize";
import { getConnForRawQuery } from "../../orm/sequelize.mjs";

export async function testing(){
    const sequelize=getConnForRawQuery();
    const query=`select gc.id,gc.id_game,gc.id_user from games_collections gc;`
    const result=await sequelize.query(query,{
        type: QueryTypes.SELECT
    })
    return  result
}


