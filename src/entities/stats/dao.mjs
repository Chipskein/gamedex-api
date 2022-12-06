import { QueryTypes } from "sequelize";
import { getConnForRawQuery } from "../../orm/sequelize.mjs";

export async function GetMoreStaredItems(){
    const sequelize=getConnForRawQuery();
    //for postgresql
    const query=`
        select 
            tmp.*,
            g.name as game_name,
            g.publisher as game_publisher,
            g.img as game_img
        from 
        (
            select 
                dense_rank() over(order by count(s.id_games_collection) desc) as rank,
                count(s.id_games_collection) as stars,    
                gc.id as id_item,
                gc.evidence_img,
                gc.id_game,
                gc.id_user
            from games_collections gc
            left join stars s on s.id_games_collection=gc.id
            group by gc.id
        ) as tmp
        inner join games g on g.id=tmp.id_game
        where 
            tmp.rank <= 5
        order by tmp.rank
        ;
    `
    const result=await sequelize.query(query,{type: QueryTypes.SELECT})
    return  result
}



