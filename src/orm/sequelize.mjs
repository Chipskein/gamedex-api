import { Sequelize } from 'sequelize';
import  Users  from '../entities/users/model.mjs'
export function CreateSequelizeInstance(){
    const DATABASE_URL=process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    return  new Sequelize(DATABASE_URL);
}
export function InitSequelizeModels(db){
    Users.init(db)
}
export function RunAssociationFromDBModels(db){
    const { models } = db;
    const modelNames=Object.keys(models)
    modelNames.map(modelName=>{
        const model=models[modelName]
        model.associate(models)
    })
}


export async function InitDatabase(){
    const db=CreateSequelizeInstance()
    InitSequelizeModels(db)
    RunAssociationFromDBModels(db)
    await db.sync()
}