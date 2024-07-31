import User from "../models/userModel.js";


export const getUserDetails = async(req, res) => {
    try{
        const id = req.user.id

        const user = await User.findByPk(id)

        res.status(200).json({status: true, message: "User successfullly fetched", user})
    }catch(error){
        console.log("Error in getUserDetails: ",error);
        res.status(500).json({status: false, message: "internal server error while fetch user data", error:error})
    }
}