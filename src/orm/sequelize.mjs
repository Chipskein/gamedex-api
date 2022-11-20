import { Sequelize } from 'sequelize';
import  Users  from '../entities/users/model.mjs'
import  Collections  from '../entities/collections/model.mjs'
import  Stars  from '../entities/stars/model.mjs'
import  Games  from '../entities/games/model.mjs'
import { ReadDefaultGames } from '../utils/dump_defaults.mjs';




export function CreateSequelizeInstance(){
    const DATABASE_URL=process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    return  new Sequelize(DATABASE_URL,{logging:false});
}
export function InitSequelizeModels(db){
    Users.init(db)
    Collections.init(db)
    Stars.init(db)
    Games.init(db)
}
export function RunAssociationFromDBModels(db){
    const { models } = db;
    const modelNames=Object.keys(models)
    modelNames.map(modelName=>{
        const model=models[modelName]
        model.associate(models)
    })
}
export async function InitDatabase(db){
    InitSequelizeModels(db)
    RunAssociationFromDBModels(db)
    await db.sync()
    const ShouldLoadDefaultGames=false;
    if(ShouldLoadDefaultGames){
        const { games }=await ReadDefaultGames()
        await Games.bulkCreate(games)
    }

}
export async function cleanDatabase(db){
    await db.sync({force:true})
}