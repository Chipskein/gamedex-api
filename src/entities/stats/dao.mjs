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
            g.img as game_img,
            u.name as user_name
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
        inner join users u on u.id=tmp.id_user
        where 
            tmp.rank <= 5
        order by tmp.rank
        ;
    `
    const result=await sequelize.query(query,{type: QueryTypes.SELECT})
    return  result
}
export async function GetUsersWithMostItems(){
    const sequelize=getConnForRawQuery();
    //for postgresql
    const query=`
        select 
            tmp.rank,
            tmp.games,
            u.id,
            u.name,
            u.email,
            u.img,
            u.active,
            u.is_data_master
        from 
        (
            select 
                dense_rank() over(order by count(gc.id_game) desc) as rank,
                count(gc.id_game) as games,    
                gc.id_user
            from games_collections gc
            
            group by gc.id_user
        ) as tmp
        inner join users u on u.id=tmp.id_user and u.active is true
        where 
            tmp.rank <= 5
        order by tmp.rank
        ;
    `
    const result=await sequelize.query(query,{type: QueryTypes.SELECT})
    return  result
}
export async function GetMorePossesedItems(){
    const sequelize=getConnForRawQuery();
    //for postgresql
    const query=`
        select 
            tmp.rank,
            tmp.game_qt,
            g.id as game_id,
            g.name as game_name,
            g.publisher as game_publisher,
            g.img as game_img
        from 
        (
            select 
                dense_rank() over(order by  count(gc.id_game) desc) as rank,
                gc.id_game,
                count(gc.id_game) as game_qt
            from games_collections gc
            group by gc.id_game
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

