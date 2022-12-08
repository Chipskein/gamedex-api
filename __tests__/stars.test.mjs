import { config } from 'dotenv';
import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
import { HTTP_STATUS } from '../src/consts/http-status.mjs';
import { cleanDatabase, CreateSequelizeInstance } from '../src/orm/sequelize.mjs';
import { createJWT } from '../src/utils/token.mjs';
import { readFile } from 'fs/promises'
import Users from '../src/entities/users/model.mjs';
import Games from '../src/entities/games/model.mjs';
import Collections from '../src/entities/collections/model.mjs';
import { ConvertBufferToBase64 } from '../src/utils/base64.mjs';
import { resizeImage } from '../src/utils/image-resizer.mjs'

const mock={
    app:null,
    database:null,
}
beforeAll(async ()=>{
    config({path:'../.env.test'})
    
    
    mock.database=CreateSequelizeInstance()
    mock.app=await CreateAppInstace(mock.database)
    const {dataValues:userAdmin}=await Users.create({
        name:"user-data-master",
        email:'usertest_data_master@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:true    
    })
    const {dataValues:user1}=await Users.create({
        name:"normal-user",
        email:'usertestNOT_data_master@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user2}=await Users.create({
        name:"normal-user2",
        email:'usertest2@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    
    const {dataValues:user3}=await Users.create({
        name:"normal-user3",
        email:'usertest3@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })

    const games=[]
    for(let c=1;c<=50;c++){
        games.push({name:`games-test${c}`,publisher:`publisher-test`,id_user:userAdmin.id})
    }
    await Games.bulkCreate(games)

    const evidence_img_path=__dirname+'/assets/img_test.jpg';
    const buffer_evidence_img=await readFile(evidence_img_path);
    const resized_buffer_evidence_img=await resizeImage(buffer_evidence_img);
    const evidence_img=ConvertBufferToBase64(resized_buffer_evidence_img);
    const collection=[]
    for(let c=1;c<=5;c++){
        collection.push({
            id_game:c,
            evidence_img,
            id_user:user1.id
        })
        collection.push({
            id_game:c,
            evidence_img,
            id_user:user2.id
        })
    }

    await Collections.bulkCreate(collection)

})
const starCollection=[
    [{id_collection:1},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.OK],
    [{id_collection:1},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.BAD_REQUEST],
    [{id_collection:9999},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.BAD_REQUEST],
    [{id_collection:3},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.OK],
]
describe.each(starCollection)('',async (body,token,statusCode)=>{
    test('POST /stars',async()=>{
        const res=await request(mock.app)
            .post('/stars')
            .set('authorization',token)
            .send(body)
        ;
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body.id_user).toBeDefined()
            expect(res.body.id_games_collection).toBe(body.id_collection)
            expect(res.body.id).toBeDefined()
        }
        
    })
})
const deleteCollection=[
    [{id_collection:1},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.OK],
    [{id_collection:3},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.OK],
    [{id_collection:5},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.BAD_REQUEST],
    [{id_collection:999999999999},createJWT({email:'usertest3@gamedex.com',id:4}),HTTP_STATUS.BAD_REQUEST],
]
describe.each(deleteCollection)('',async (body,token,statusCode)=>{
    test('POST /stars/delete',async()=>{
        const res=await request(mock.app)
            .post('/stars/delete')
            .set('authorization',token)
            .send(body)
        ;
        expect(res.statusCode).toBe(statusCode)
    })
})

afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


