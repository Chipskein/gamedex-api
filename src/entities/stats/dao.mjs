import { QueryTypes } from "sequelize";
import { getConnForRawQuery } from "../../orm/sequelize.mjs";

export async function testing(){
    const sequelize=getConnForRawQuery();
    //for postgresql
    const query=`
        select 
            gc.id as idItem,
            count(*) as stars_count
        from 
            games_collections gc
        join stars s on s.id_games_collection=gc.id
        group by gc.id
        ;`
    const result=await sequelize.query(query,{
        type: QueryTypes.SELECT
    })
    return  result
}


