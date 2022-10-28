import { config } from 'dotenv';
config();
import { CreateAppInstace } from './app.mjs';
import { CreateSequelizeInstance } from './orm/sequelize.mjs';
const PORT=process.env.PORT || 3001;  
const db=CreateSequelizeInstance()
const app = await CreateAppInstace(db)
app.listen(PORT,() => console.log(`Listing on PORT ${PORT}`))