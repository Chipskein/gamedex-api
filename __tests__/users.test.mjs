import { config } from 'dotenv';
import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
import { HTTP_STATUS } from '../src/consts/http-status.mjs';
import { cleanDatabase, CreateSequelizeInstance } from '../src/orm/sequelize.mjs';
const mock={
    app:null,
    database:null,
}
beforeAll(async ()=>{
    config({path:'../.env.test'})
    mock.database=CreateSequelizeInstance()
    mock.app=await CreateAppInstace(mock.database)
})


const CreateUserTable=[
    [{name:"afhnjashfjashfas",email:"emailinvalido",password:"senharandom"},HTTP_STATUS.BAD_REQUEST],
    [{name:'',email:"email@example.com",password:"senharandom"},HTTP_STATUS.BAD_REQUEST],
    [{name:'nome valido',email:"email@example.com",password:"senharandom"},HTTP_STATUS.OK],
    [{name:'nome valido',email:"222email@example.com",password:""},HTTP_STATUS.BAD_REQUEST],
    [{name:'email ja cadastrado',email:"email@example.com",password:"123456"},HTTP_STATUS.BAD_REQUEST],
]
describe.each(CreateUserTable)('Body:%j expected Status Code:%d',(body,statusCode)=>{
    test('POST /users/',async ()=>{
        const res=await request(mock.app).post('/users')
        .field('name',body.name)
        .field('email',body.email)
        .field('password',body.password)
        .attach('img',`${__dirname}/assets/img_test.jpg`)
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body).toContain({
                name: body.name,
                email: body.email,
            })
            expect(res.body.password).toBeUndefined()
        }
    })
})
afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


