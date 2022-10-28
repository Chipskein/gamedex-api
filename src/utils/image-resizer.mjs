import sharp from 'sharp'
const PREVIEW_WIDTH=320;
const PREVIEW_HEIGHT=320;

export async function resizeImage(input_image_buffer){
    const input=sharp(input_image_buffer)
    const process_data=input.resize(PREVIEW_WIDTH,PREVIEW_HEIGHT,{fit: 'inside'})
    const output=process_data.toBuffer();
    return output
}