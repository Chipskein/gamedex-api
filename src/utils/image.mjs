import path from 'path';
import multer from 'multer';
import { resizeImage } from './image-resizer.mjs'
import { ConvertBufferToBase64 } from './base64.mjs'
import { readFile, rm } from 'fs/promises';
import { createReadStream } from 'fs';
import { uploadFromStream } from '../apis/imgur.mjs';

const multer_config= {
    dest: path.resolve() + "/tmp"
}

console.log("path ", `${path.resolve()}\\tmp`)

export const upload = multer(multer_config);

export async function uploadImage(file){
    const stream=createReadStream(file.path);
    const data=await uploadFromStream(stream);
    await rm(file.path);
    return data?.link || null
}

export function ValidImageMimeType(mimetype){
    const ValidMimetypes=[
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
    ]
    return ValidMimetypes.includes(mimetype)
}

export async function processEvidenceImage(file){
    const { path,mimetype } = file
    const buffer=await readFile(path)
    const resizedBuffer=await resizeImage(buffer)
    const base64=ConvertBufferToBase64(resizedBuffer)
    const base64String=`data:${mimetype};base64,${base64}`
    //await rm(path)
    return base64String   
}
