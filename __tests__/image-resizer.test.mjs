import {afterAll, beforeAll, describe,expect,test} from 'vitest'
import { readFile,writeFile } from 'fs/promises'
import path from 'path'
import { resizeImage } from '../src/utils/image-resizer.mjs'
import { ConvertBufferToBase64,VerifyIfIsBase64 } from '../src/utils/base64.mjs'
const TestFilesPath=[
    `${__dirname}/assets/img_test.jpg`,
]
describe.each(TestFilesPath)('Filepath: %s',(filepath)=>{
    test('Should Resize File',async ()=>{
        const imageBuffer=await readFile(filepath)
        const resizedImageBuffer=await resizeImage(imageBuffer)
        expect(resizedImageBuffer.length).toBeLessThan(imageBuffer.length)
    })
    test('Should Resize File and write to file',async ()=>{
        const imageBuffer=await readFile(filepath)
        const resizedImageBuffer=await resizeImage(imageBuffer)
        expect(resizedImageBuffer.length).toBeLessThan(imageBuffer.length)
        const name=path.parse(filepath).name+'_resized'
        const ext=path.parse(filepath).ext
        await writeFile(`${__dirname}/assets/${name}${ext}`,resizedImageBuffer)
    })
    test('Should Resize and Convert to base64',async ()=>{
        const imageBuffer=await readFile(filepath)
        const resizedImageBuffer=await resizeImage(imageBuffer)
        expect(resizedImageBuffer.length).toBeLessThan(imageBuffer.length)
        const base64str=ConvertBufferToBase64(resizedImageBuffer)
        expect(VerifyIfIsBase64(base64str)).toBe(true)
    })
})

