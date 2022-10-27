import { config } from 'dotenv';
config();
import { CreateAppInstace } from './app.mjs';
//import {CreateSequelizeInstance } from './database/orm/sequelize.mjs'
const PORT=process.env.PORT || 3001;  
//const database=CreateSequelizeInstance()
const app = CreateAppInstace()
app.listen(PORT,() => console.log(`Listing on PORT ${PORT}`))