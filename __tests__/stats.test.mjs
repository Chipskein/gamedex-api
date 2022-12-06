import { config } from 'dotenv';
import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { CreateAppInstace } from '../src/app.mjs'
import request  from 'supertest';
import { HTTP_STATUS } from '../src/consts/http-status.mjs';
import { cleanDatabase, CreateSequelizeInstance } from '../src/orm/sequelize.mjs';
import { verifyJWT,createJWT } from '../src/utils/token.mjs';
import { readFile } from 'fs/promises'
import Users from '../src/entities/users/model.mjs';
import Games from '../src/entities/games/model.mjs';
import Collections from '../src/entities/collections/model.mjs';
import Stars from '../src/entities/stars/model.mjs';
import { resizeImage } from '../src/utils/image-resizer.mjs'
import { ConvertBufferToBase64 } from '../src/utils/base64.mjs';
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
    const {dataValues:user4}=await Users.create({
        name:"normal-user4",
        email:'usertest4@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user5}=await Users.create({
        name:"normal-user5",
        email:'usertest5@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user6}=await Users.create({
        name:"normal-user6",
        email:'usertest6@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user7}=await Users.create({
        name:"normal-user7",
        email:'usertest7@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user8}=await Users.create({
        name:"normal-user8",
        email:'usertest8@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user9}=await Users.create({
        name:"normal-user9",
        email:'usertest9@gamedex.com',
        password:'senhanaoencriptada',
        is_data_master:false    
    })
    const {dataValues:user10}=await Users.create({
        name:"normal-user10",
        email:'usertest10@gamedex.com',
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
    for(let c=1;c<=10;c++){
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
        collection.push({
            id_game:c,
            evidence_img,
            id_user:user3.id
        })
        collection.push({
            id_game:c,
            evidence_img,
            id_user:user4.id
        })
    }
    await Collections.bulkCreate(collection)
    const stars=[
        {id_games_collection:1,id_user:2},
        {id_games_collection:1,id_user:3},
        {id_games_collection:1,id_user:4},
        {id_games_collection:1,id_user:10},
        {id_games_collection:1,id_user:5},
        {id_games_collection:1,id_user:6},
        {id_games_collection:1,id_user:7},
        {id_games_collection:1,id_user:8},
        {id_games_collection:1,id_user:9},

        {id_games_collection:5,id_user:1},
        {id_games_collection:5,id_user:3},
        {id_games_collection:5,id_user:4},
        {id_games_collection:5,id_user:5},
        {id_games_collection:5,id_user:6},
        {id_games_collection:5,id_user:7},
        {id_games_collection:5,id_user:8},
        {id_games_collection:5,id_user:9},

        {id_games_collection:10,id_user:2},
        {id_games_collection:10,id_user:4},
        {id_games_collection:10,id_user:5},
        {id_games_collection:10,id_user:6},
        {id_games_collection:10,id_user:7},
        {id_games_collection:10,id_user:8},
        {id_games_collection:10,id_user:9},
        {id_games_collection:10,id_user:10},

        {id_games_collection:15,id_user:2},
        {id_games_collection:15,id_user:3},
        {id_games_collection:15,id_user:7},
        {id_games_collection:15,id_user:8},
        {id_games_collection:15,id_user:9},
        {id_games_collection:15,id_user:10},

        {id_games_collection:16,id_user:2},
        {id_games_collection:16,id_user:3},
        {id_games_collection:16,id_user:7},
        {id_games_collection:16,id_user:8},
        {id_games_collection:16,id_user:9},
        
        {id_games_collection:17,id_user:3},
        {id_games_collection:17,id_user:7},
        {id_games_collection:17,id_user:8},
        {id_games_collection:17,id_user:9},

        {id_games_collection:20,id_user:3},
        {id_games_collection:20,id_user:2},
        {id_games_collection:20,id_user:1},
        
        {id_games_collection:21,id_user:7},
        {id_games_collection:21,id_user:9},

        {id_games_collection:25,id_user:7},

    ]
    await Stars.bulkCreate(stars)

})

describe("RANKS",()=>{
    it("Should get Top 5 more stared items",async ()=>{
        const token=createJWT({id:2,email:"usertestNOT_data_master@gamedex.com"})
        const res=await request(mock.app).get('/stats/more-stared-items').set('authorization',token);
        expect(res.statusCode).toBe(HTTP_STATUS.OK)
        const {items} = res.body
        expect(items.length).toBeGreaterThan(0)
        items.map(
            (item,index)=>{
                expect(Number(item.rank)).toBeTypeOf('number')
                expect(Number(item.stars)).toBeTypeOf('number')
                expect(item.id_item).toBeTypeOf('number')
                expect(item.evidence_img).toBeTypeOf('string')
                expect(item.id_game).toBeTypeOf('number')
                expect(item.id_user).toBeTypeOf('number')
                expect(item.game_name).toBeTypeOf('string')
                expect(item.game_publisher).toBeTypeOf('string')
                expect(item.game_img).toBeTypeOf('string')

                if(index==items.length-1){
                    expect(Number(item.rank)).toBe(5)
                }
            }
        )
        
    })
    it("Should Get TOP 5 Users with most items",async ()=>{
        const token=createJWT({id:2,email:"usertestNOT_data_master@gamedex.com"})
        const res=await request(mock.app).get('/stats/users-most-items').set('authorization',token);
        expect(res.statusCode).toBe(HTTP_STATUS.OK)
        const { users } = res.body
        expect(users.length).toBeGreaterThan(0)
        users.map(
            (user,index)=>{
                console.log(user)
                expect(Number(user.rank)).toBeTypeOf('number')
                expect(Number(user.games)).toBeTypeOf('number')
                expect(user.id).toBeTypeOf('number')
                expect(user.name).toBeTypeOf('string')
                expect(user.email).toBeTypeOf('string')
                expect(user.img).toBeDefined()
                expect(user.active).toBeTypeOf('boolean')
                expect(user.is_data_master).toBeTypeOf('boolean')
                if(index==users.length-1){
                    expect(Number(user.rank)).toBeLessThanOrEqual(5)
                }

            }
        )  
    })
 /*
    it("Should Get TOP 5 Items that more people have it",()=>{
        expect(false).toBeTruthy()
    })
*/
})


afterAll(async ()=>{
    await cleanDatabase(mock.database)
})


