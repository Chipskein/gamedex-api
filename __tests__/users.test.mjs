import { config } from 'dotenv';
import {beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
const mock={app:null}
beforeAll(async ()=>{
    config({path:'../.env.test'})
    mock.app=await CreateAppInstace()
})

describe("Create User",()=>{
    test("",async ()=>{
        const response=await request(mock.app).post('/users')
        expect(response.statusCode).toBe(404)
    })    
})



