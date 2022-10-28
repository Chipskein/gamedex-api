import { config } from 'dotenv';
import { test } from 'vitest'



test('should ', () => {
    config({path:'../.env.test'})
    console.log(process.env.VITE_DATABASE_URL)
    return 
});
