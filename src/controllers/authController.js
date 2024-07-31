import { comparePassword, encrypt, generateToken } from "../helper/utils.js";
import User from "../models/userModel.js";


export const registerUser = async(req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({status:false, message: "Please enter email and password"})
        }

        const userExists = await User.findOne({where:{email}})

        if(userExists){
            return res.status(400).json({message: "User already exists please login..."})
        }

        const hashedPassword = await encrypt(password)
        
        const newUser = {
            email: email,
            password: hashedPassword,
            profile_image: req.file.path
        }
        const user = await User.create(newUser)

        if(user){
            return res.status(201).json({status:true, message: "User successfully registered"})
        }
    }catch(error){
        console.log("Internal error while registering user: ",error);
        res.status(500).json({status: false, message: "Internal error while registering user", error:error})
    }
}

export const loginUser = async(req, res) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({status:false, message: "email and password is required to login"})
        }

        const checkUser = await User.findOne({where:{email: email}})

        if(!checkUser){
            return res.status(404).json({status: false, message: "User not found please register first"})
        }

        const comparePass = await comparePassword(password, checkUser.password)

        if(!comparePass){
            return res.status(400).json({status:false, message: "Email or Password is invalid"})
        }

        const token = await generateToken(checkUser.id)

        const user = {
            id: checkUser.id,
            email: checkUser.email,
            token: token
        }

        res.status(200).json({status:false, message: "Login success", user: user})

    }catch(error){
        console.log("Internal error while login: ",error);
        res.status(500).json({status: false, message: "Internal error while login", error:error})
    }
}