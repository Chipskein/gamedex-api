import path from 'path';
import multer from 'multer';
import { rm } from 'fs/promises';
import { createReadStream } from 'fs';
import { uploadFromStream } from '../apis/imgur.mjs';
const multer_config={
    dest:`${path.resolve()}/tmp`
}
export const upload=multer(multer_config);
export async function uploadImage(file){
    const stream=createReadStream(file.path);
    const data=await uploadFromStream(stream);
    await rm(file.path);
    return data?.link || null
}

