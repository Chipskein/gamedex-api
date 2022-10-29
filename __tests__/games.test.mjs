import { config } from 'dotenv';
import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
import { HTTP_STATUS } from '../src/consts/http-status.mjs';
import { cleanDatabase, CreateSequelizeInstance } from '../src/orm/sequelize.mjs';
import { createJWT } from '../src/utils/token.mjs';
import Users from '../src/entities/users/model.mjs';
import Games from '../src/entities/games/model.mjs';

const mock={
    app:null,
    database:null,
    user_master:null,
}
beforeAll(async ()=>{
    config({path:'../.env.test'})
    mock.database=CreateSequelizeInstance()
    mock.app=await CreateAppInstace(mock.database)
    
    const {dataValues:user}=await Users.create({
        name:"user-data-master",
        email:'usertest_data_master@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:true    
    })
    mock.user=user;    

    for(let c=1;c<=50;c++){
        await Games.create({
            name:`games-test${c}`,
            publisher:`publisher-test`,
            id_user:user.id
        })
    }
    
})




test('eaiman',async ()=>{
    return
})






afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


