import { HTTP_STATUS } from '../../consts/http-status.mjs';
import { rm } from 'fs/promises'
import { validateUser } from './validator.mjs';
import Users from './model.mjs';
import { hashPassword } from '../../utils/password.mjs';
export async function CreateUser(req,res){
    const { file,body }=req 
    const {path:serverPath } =file
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
        const {dataValues:user} = await Users.create({
            name,
            email,
            password:hashedPassword
        })
        
        delete(user.password)
        await rm(serverPath)
        return res.status(HTTP_STATUS.OK).json(user)
    }
    catch(err){
        await rm(serverPath)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
