import { HTTP_STATUS } from "../consts/http-status.mjs";
import Users from "../entities/users/model.mjs";

export async function isDataMaster(req,res,next){
    const { id:userId } = req.user
    const {dataValues:{is_data_master}}=await Users.findByPk(userId)
    if(!is_data_master){
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            msg:"User has no permission"
        })
    }
    next();
}
