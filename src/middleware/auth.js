import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

export const auth = async(req, res, next) => {
    try{
        let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')

        if(!token){
            return res.status(401).send({ status: false, message: "Unauthorized: Token not found" })
        }

        token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const userData = await User.findByPk(decoded.id)

        if(!userData){
            return res.status(403).send({ status: false, message: "Invalid token" })
        }

        req.token = token;
        req.user = userData;

        next();
    }catch(error){
        // console.log("Error in auth: ",error);
        if(error.message === "jwt malformed"){
            return res.status(403).json({status:false, message: "Not authorized, token failed"})
        } else{
            return res.status(403).json({status:false, message: error.message})
        }

    }
}