import { HTTP_STATUS } from '../../consts/http-status.mjs';
import { rm } from 'fs/promises'
import { validateUser } from './validator.mjs';
import Users from './model.mjs';
import { hashPassword } from '../../utils/password.mjs';
import { uploadImage } from '../../utils/image.mjs';
export async function CreateUser(req,res){
    const { file,body }=req 
    const serverPath =file?.path
    try{
        const isInvalid=await validateUser(body)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const {name,email,password} =body
        const hashedPassword=await hashPassword(password)
        let img=null
        if(file) img=await uploadImage(file)

        const {dataValues:user} = await Users.create({
            name,
            email,
            password:hashedPassword,
            img
        })
        delete(user.password)
        return res.status(HTTP_STATUS.OK).json(user)
    }
    catch(err){
        if(serverPath) await rm(serverPath)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
