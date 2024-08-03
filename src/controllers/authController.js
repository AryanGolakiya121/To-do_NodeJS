import { sendMail } from "../helper/sendEmail.js";
import { comparePassword, encrypt, generateToken } from "../helper/utils.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import ResetPass from "../models/resetPassModel.js";
import { Op, } from "sequelize";

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
            profile_image: req.file.path,
            is_verified: false,
        }
        const user = await User.create(newUser)

        // if(user){
        //     return res.status(201).json({status:true, message: "User successfully registered"})
        // }
        const token = jwt.sign({email: email},  process.env.JWT_SECRET, { expiresIn: "1h" })

        const verifyLink = `${process.env.BASE_URL}/api/public/auth/verify/${user.id}/${token}`

        await sendMail(user.email, "Verify Email", verifyLink)

        res.status(201).json({status:true, message: `An Email sent to your email address please verify`})

    }catch(error){
        console.log("Internal error while registering user: ",error);
        res.status(500).json({status: false, message: "Internal error while registering user", error:error})
    }
}

export const verifyUser = async(req, res) => {
    try{
        const id = req.params.id;
        const token = req.params.token;
        const user = await User.findByPk(id)

        if(!user){
            return res.status(400).json({ status: false, message: "Invalid link" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(user.email !== decodedToken.email){
            return res.status(400).json({ status: false, message: "Invalid link"})
        }

        const tokenAge = new Date() - new Date(user.verificationTokenCreatedAt)
        const tokenExpirationTime = 1 * 60 * 60 * 1000; //1 hour

        if(tokenAge > tokenExpirationTime){
            return res.status(400).json({ status: false, message: "Token has expired. Please request a new verification link." });
        }

        user.is_verified = true;
        await user.save();

        res.status(200).json({ status: true, message: "Email verified successfully" });

    }catch(error){
        // console.log("Internal server error in verifyUser email: ",error);
        if(error.name === 'TokenExpiredError'){
            return res.status(400).json({ status: false, message: "Verification link is expired. Please request a new verification link" })
        }
        res.status(500).json({status:false, message:"Internal server error in verifyUser email", error: error.message})
    }
}

export const resendVerificationEmail = async(req, res) => {
    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({status: false, message: "Email is required"})
        }

        const user = await User.findOne({ where :{ email }})

        if(!user){
            return res.status(404).json({status: false, message: `User not found with this email: ${email}`})
        }

        if(user.is_verified){
            return res.status(400).json({status: false, message: "Email is already verified"})
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn : "1h" });

        user.verificationTokenCreatedAt = new Date();

        await user.save();

        const veriyLink = `${process.env.BASE_URL}/api/public/auth/verify/${user.id}/${token}`

        const html = `Please click on this link to verify your email: <a href="${veriyLink}">Link</a>`;

        await sendMail(user.email, "Verify Emal", html)

        res.status(200).json({ status: true, message: `Verification emal resent to ${user.email}`})

    }catch(error){
        console.log("Error in resed verification email: ",error);
        res.status(500).json({status: false, message: "Internal Error in resed verification email", error: error.message})
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

export const forgotPassword = async(req, res) => {
    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({ status: false, message: "Please enter your email" });
        }

        const user = await User.findOne({ where: { email }})

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const resetToken =  crypto.randomBytes(32).toString("hex")
        const resetTokenHash = await encrypt(resetToken)
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        const resetPass = {
            token: resetTokenHash,
            expires: resetTokenExpires,
            userId: user.id
        }

        await ResetPass.create(resetPass)

        const resetUrl = `${process.env.BASE_URL}/api/public/auth/reset-password/${resetToken}`

        const html = `Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a>`;

        await sendMail(email, "Password Reset", html);

        res.status(200).json({ status: true, message: `Password reset email sent to your registered email: ${email}` });

    }catch(error){
        console.error("Internal error in forgotPassword: ", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
}

export const resetPassword = async(req, res) => {
    try{
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if(!password || !confirmPassword){
            return res.status(400).json({ status: false, message: "Password and confirmPassword are required" });
        }

        if(password !== confirmPassword){
            return res.status(400).json({status: false, message: "Password is not match with confirm password"})
        }

        const resetPassEntry = await ResetPass.findOne({
            where: {
                expires: { [Op.gt]: Date.now() }
            },
            include: [{
                model: User,
                as: "user"
            }],
            
        })

        if(!resetPassEntry){
            return res.status(400).json({ status: false, message: "Failed to reset password please try again"})
        }

        const isTokenValid = await comparePassword(token, resetPassEntry.token )

        if(!isTokenValid){
            return res.status(400).json({status: false, message: "Invalid or expired reset token"})
        }

        const hashedPassword = await encrypt(password)

        await User.update(
            { password: hashedPassword },
            { where: { id: resetPassEntry.userId }}
        )

        await resetPassEntry.destroy()

        res.status(200).json({ status: true, message: "Password has been reset successfully" });

    }catch(error){
        console.error("Internal error in resetPassword: ", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
}