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
    const games=[]
    for(let c=1;c<=50;c++){
        games.push({name:`games-test${c}`,publisher:`publisher-test`,id_user:userAdmin.id})
    }
    await Games.bulkCreate(games)

    const evidence_img_path=__dirname+'/assets/img_test.jpg';
    const buffer_evidence_img=await readFile(evidence_img_path);
    const resized_buffer_evidence_img=await resizeImage(buffer_evidence_img);
    const evidence_img=ConvertBufferToBase64(resized_buffer_evidence_img);
    //create collection for user 1
    const collection=[]
    for(let c=1;c<=5;c++){
        collection.push({
            id_game:c,
            evidence_img,
            id_user:user1.id
        })
    }

    const col=await Collections.bulkCreate(collection)
})

describe.each([[0,0,0]])('',async (body,token,statusCode)=>{
    test('POST /stars',async()=>{
        //const res=await request(mock.app).post('/collection').attach('evidence_img',body.evidence_img).field('id_game',body.id_game).set('authorization',token);
        //expect(res.statusCode).toBe(statusCode)
        //if(res.statusCode==HTTP_STATUS.OK){
        //}
        return 
    })
})

afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


