import { readFile } from 'fs/promises';
import { join,dirname } from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function ReadDefaultGames(){
    const file_games_Default=join(__dirname,'../','consts','default_games_items.json')
    const bufferJson=await readFile(file_games_Default)
    const games_json=bufferJson.toString('utf8')
    return JSON.parse(games_json)
}