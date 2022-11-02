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
    await Users.create({
        name:"normal-user",
        email:'usertestNOT_data_master@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })

    const games=[]
    for(let c=1;c<=50;c++){
        games.push({name:`games-test${c}`,publisher:`publisher-test`,id_user:user.id})
    }
    await Games.bulkCreate(games)
    
})


const CreateNewGame=[
    [{name:1,publisher:'EA GAMES'},createJWT({id:1,email:'usertest_data_master@gamedex.com',active:true}),HTTP_STATUS.BAD_REQUEST],
    [{},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com',active:true}),HTTP_STATUS.FORBIDDEN],
    [{name:'FIFA 15',publisher:'EA GAMES'},createJWT({id:1,email:'usertest_data_master@gamedex.com',active:true}),HTTP_STATUS.OK],
    [{name:'FIFA 15',publisher:'EA GAMES'},createJWT({id:1,email:'usertest_data_master@gamedex.com',active:true}),HTTP_STATUS.BAD_REQUEST],
]
describe.each(CreateNewGame)('',async (body,token,statusCode)=>{
    test('POST /games',async()=>{
        const res=await request(mock.app).post('/games').send(body).set('authorization',token);
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body).contain({
                name:body.name,
                publisher:body.publisher,
                id_user:1
            })
        }
    })
})
const GetGames=[
    [{limit:10,offset:0},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com',}),HTTP_STATUS.OK],
    [{limit:10,offset:11},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com',}),HTTP_STATUS.OK],
    [{},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com',}),HTTP_STATUS.OK],
]
describe.each(GetGames)('',async (query,token,statusCode)=>{
    test('GET /games',async()=>{
        const res=await request(mock.app).get('/games').query(query).set('authorization',token);
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            if(query.limit&&query.offset){
                expect(res.body).contain({
                    limit:query.limit,
                    offset:query.offset
                })
            }
            expect(res.body.count).toBeGreaterThanOrEqual(0)
            expect(res.body.games.length).toBeGreaterThanOrEqual(0)
            res.body.games.map(game=>{
                expect(game.name).toBeDefined()
                expect(game.publisher).toBeDefined()
                expect(game.id_user).toBeDefined()
            })

        }
    })
})








afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


