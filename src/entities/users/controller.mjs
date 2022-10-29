import { HTTP_STATUS } from '../../consts/http-status.mjs';
import { rm } from 'fs/promises'
import { validateUser,validateAuthUser,validateUpdateUser } from './validator.mjs';
import Users from './model.mjs';
import { hashPassword,verifyPassword } from '../../utils/password.mjs';
import { uploadImage } from '../../utils/image.mjs';
import { createJWT } from '../../utils/token.mjs';
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
        if(serverPath) img=await uploadImage(file)

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
export async function AuthUser(req,res){
    const { body }=req 
    try{
        const isInvalid=await validateAuthUser(body)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const {email,password} = body
        const {dataValues:user}=await Users.findOne({where:{email}})
        const {id,password:hashedPassword}=user
        if(! await verifyPassword(password,hashedPassword)){
            throw {
                status:HTTP_STATUS.UNAUTHORIZED,
                message:'Invalid Password'
            }
        }
        const token=createJWT({id,email})
        return res.status(HTTP_STATUS.OK).json({token})
    }
    catch(err){
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
export async function UpdateUser(req,res){
    const { file,body }=req 
    const serverPath =file?.path
    try{
        const {id,email} =req.user
        const isInvalid=await validateUpdateUser(body,email)
        if(isInvalid){
            throw {
                status:HTTP_STATUS.BAD_REQUEST,
                message:isInvalid.details[0].message
            }
        }
        const updateRow={};
        const {name,password} = body;
        if(name) updateRow.name=name;
        if(password) updateRow.password=await hashPassword(password);
        if(serverPath) updateRow.img=await uploadImage(file);
        await Users.update(updateRow, {
            where: {
              email: email
            }
        });
        const {dataValues:user} =await Users.findByPk(id)
        delete(user.password)
        return res.status(HTTP_STATUS.OK).json(user)
    }
    catch(err){
        if(serverPath) await rm(serverPath)
        let statusCode=err.status || HTTP_STATUS.INTERNAL_ERROR
        return res.status(statusCode).json({ msg: err.message})
    }
}
