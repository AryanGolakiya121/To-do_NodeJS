import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

export const generateToken = (id) => {
    try{

        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
    }catch(err){
        throw new Error(err)
    }
}

export const encrypt = async(password) => {

    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
    // return bcrypt.hash(password, 10)
}

export const comparePassword = (plainPass, hashedPass) => {
    return bcrypt.compare(plainPass, hashedPass)
}