
import FormData from 'form-data';
import axios from 'axios';
const clientId=process.env.IMGUR_CLIENT_ID;
const imgurUploadURL='https://api.imgur.com/3/upload';
export async function uploadFromStream(stream){
    const data = new FormData();
    data.append('image',stream);
    const config = {
        method: 'post',
        url: imgurUploadURL,
        headers: { 
            'Authorization': `Client-ID ${clientId}`,
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            ...data.getHeaders()
        },
        data:data
    };
    const response=await axios.request(config);
    return response.data.data
}
