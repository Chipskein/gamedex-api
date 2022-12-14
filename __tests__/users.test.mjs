import { config } from 'dotenv';
import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
import { HTTP_STATUS } from '../src/consts/http-status.mjs';
import { cleanDatabase, CreateSequelizeInstance } from '../src/orm/sequelize.mjs';
import { verifyJWT,createJWT } from '../src/utils/token.mjs';

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
    [{name:'nome valido2',email:"email2@example.com",password:"senharandom"},HTTP_STATUS.OK],
    [{name:'nome valido3',email:"email3@example.com",password:"senharandom"},HTTP_STATUS.OK],
    [{name:'nome valido4',email:"email4@example.com",password:"senharandom"},HTTP_STATUS.OK],
    [{name:'nome valido5',email:"email5@example.com",password:"senharandom"},HTTP_STATUS.OK],
]
describe.each(CreateUserTable)('Body:%j expected Status Code:%d',(body,statusCode)=>{
    test('POST /users/ without image',async ()=>{
        const res=await request(mock.app).post('/users').send(body)
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body).toContain({
                name: body.name,
                email: body.email,
            })
            expect(res.body.password).toBeUndefined()
            expect(res.body.id).toBeDefined()
        }
    })
})
const AuthUserTable=[
    [{email:"email@example.com",password:"senharandom"},HTTP_STATUS.OK],
    [{email:"email@example.com",password:"senhaerrada"},HTTP_STATUS.UNAUTHORIZED],
    [{email:"user@naoexiste.com",password:"senhaerrada"},HTTP_STATUS.BAD_REQUEST],
]
describe.each(AuthUserTable)('Body:%j expected Status Code:%d',(body,statusCode)=>{
    test('POST /users/auth',async ()=>{
        const res=await request(mock.app).post('/users/auth').send(body)
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body.token).toBeDefined()
            expect(res.body.id).toBeDefined()
            expect(res.body.name).toBeDefined()
            expect(res.body.email).toBeDefined()
            expect(res.body.active).toBeDefined()
            expect(res.body.img).toBeDefined()
            expect(res.body.is_data_master).toBeDefined()
            expect(res.body.createdAt).toBeDefined()
            expect(res.body.updatedAt).toBeDefined()
            const tokenParse=verifyJWT(res.body.token)
            expect(tokenParse).toContain({
                email:body.email,
            })
        }
    })
})
const UpdateUserTable=[
    [{name:"12"},createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.OK],
    [{name:"123",password:""},createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.BAD_REQUEST],
    [{name:"123",password:"12"},createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.BAD_REQUEST],
    [{password:"123456"},createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.OK],
    [{name:"alterando nome",password:"123456"},createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.OK],
    [{name:"alterando nome",password:"123456"},createJWT({id:3,email:"email@example.com"}),HTTP_STATUS.UNAUTHORIZED],
    [{name:"alterando nome",password:"123456"},createJWT({id:1,email:"tokeninvalido@example.com"}),HTTP_STATUS.UNAUTHORIZED],
]
describe.each(UpdateUserTable)('Body:%j token:%s expected Status Code:%d',(body,token,statusCode)=>{
    test('PUT /users/ without image',async ()=>{
        const res=await request(mock.app).put('/users/').send(body).set('authorization',token);
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            if(body.name) expect(res.body).toContain({name: body.name});
            expect(res.body.password).toBeUndefined()
            expect(res.body.id).toBeDefined()
        }
    })
})
const DeleteUserTable=[
    [createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.OK],
    [createJWT({id:1,email:"email@example.com"}),HTTP_STATUS.UNAUTHORIZED],
]
describe.each(DeleteUserTable)('Token:%s expected Status Code:%d',(token,statusCode)=>{
    test('DELETE /users/',async ()=>{
        const res=await request(mock.app).delete('/users/').set('authorization',token);
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            expect(res.body).toContain({
                active:false
            })
            expect(res.body.password).toBeUndefined()
            expect(res.body.id).toBeDefined()
            expect(res.body.name).toBeDefined()
            expect(res.body.email).toBeDefined()
        }
    })
})
const SearchUserTable=[
    [{search:"test"},HTTP_STATUS.OK,0],
    [{search:"nome"},HTTP_STATUS.OK,4],
    [{search:"nome",limit:2},HTTP_STATUS.OK,4],
    [{search:"nome",limit:2,offset:2},HTTP_STATUS.OK,4],
    [{search:"naum tem"},HTTP_STATUS.OK,0],
]
describe.each(SearchUserTable)('Query:%j expected Status Code:%d',(query,statusCode,qt)=>{
    test('GET /users/search',async ()=>{
        const token=createJWT({id:2,email:'email2@example.com'})
        const res=await request(mock.app).get('/users/search').query(query).set('authorization',token);
        expect(res.statusCode).toBe(statusCode)
        if(res.statusCode==HTTP_STATUS.OK){
            const {limit,offset,count,users} = res.body
            expect(users.length).toBeLessThanOrEqual(limit)
            expect(count).toBe(qt)
            users.map((user)=>{
                expect(user.name).toBeDefined()
                expect(user.email).toBeDefined()
                expect(user.id).toBeDefined()
                expect(user.password).toBeUndefined()
            })
        }
    })
})
const GetUserTable=[
    [1,HTTP_STATUS.BAD_REQUEST],
    [2,HTTP_STATUS.OK],
    [3,HTTP_STATUS.OK],
    [4,HTTP_STATUS.OK],
    [5,HTTP_STATUS.OK],
]
describe.each(GetUserTable)('UserId:%d expected Status Code:%d',(userId,statusCode)=>{
    test(`GET /users/${userId}`,async ()=>{
        const token=createJWT({id:2,email:'email2@example.com'})
        const res=await request(mock.app).get(`/users/${userId}`).set('authorization',token);
        expect(res.statusCode).toBe(statusCode)
    })
})
test('GET /users/',async ()=>{
    const token=createJWT({id:2,email:'email2@example.com'})
    const res=await request(mock.app).get(`/users/`).set('authorization',token);
    expect(res.statusCode).toBe(HTTP_STATUS.OK)
})









afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


