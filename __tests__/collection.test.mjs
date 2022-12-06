import { config } from 'dotenv';
import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
import { HTTP_STATUS } from '../src/consts/http-status.mjs';
import { cleanDatabase, CreateSequelizeInstance } from '../src/orm/sequelize.mjs';
import { createJWT } from '../src/utils/token.mjs';
import Users from '../src/entities/users/model.mjs';
import Games from '../src/entities/games/model.mjs';
import { VerifyIfIsBase64 } from '../src/utils/base64.mjs';

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
    await Users.create({
        name:"normal-user",
        email:'usertestNOT_data_master2@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const games=[]
    for(let c=1;c<=50;c++){
        games.push({name:`games-test${c}`,publisher:`publisher-test`,id_user:user.id})
    }
    await Games.bulkCreate(games)
    
})


const MarkGameDex=[
    [{id_game:1,evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.OK],
    [{id_game:1,evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.BAD_REQUEST],
    [{id_game:1,evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:3,email:'usertestNOT_data_master2@gamedex.com'}),HTTP_STATUS.OK],
    [{id_game:2,evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:3,email:'usertestNOT_data_master2@gamedex.com'}),HTTP_STATUS.OK],
    [{id_game:99999,evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.BAD_REQUEST],
    [{id_game:'should fail',evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.BAD_REQUEST],
    [{id_game:'null',evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.BAD_REQUEST],
    [{id_game:2,evidence_img:`${__dirname}/assets/img_test2.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.OK],
    [{id_game:4,evidence_img:`${__dirname}/assets/img_test3.jpg`},createJWT({id:2,email:'usertestNOT_data_master@gamedex.com'}),HTTP_STATUS.OK],
    [{id_game:4,evidence_img:`${__dirname}/assets/img_test.jpg`},createJWT({id:3,email:'usertestNOT_data_master2@gamedex.com'}),HTTP_STATUS.OK],
]
describe.each(MarkGameDex)('',async (body,token,statusCode)=>{
    test('POST /collection',async()=>{
        const res=await request(mock.app)
            .post('/collection')
            .attach('evidence_img',body.evidence_img)
            .field('id_game',body.id_game)
            .set('authorization',token)
        ;
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body).contain({id_game:body.id_game})
            expect(res.body.evidence_img).toBeDefined()
            const base64_data=res.body.evidence_img.split(',')[1]
            const isInBase64Encode=VerifyIfIsBase64(base64_data)
            expect(isInBase64Encode).toBeTruthy()
        }
    })
})


afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


