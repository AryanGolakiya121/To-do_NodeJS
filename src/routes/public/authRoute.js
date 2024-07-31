import express from "express";
import { registerUser, loginUser } from "../../controllers/authController.js"
import { loginValidator, registerValidator } from "../../validators/userValidator.js";
import uploadProfilePic from "../../middleware/uploadProfile.js";

const router = express.Router();


// router.post("/register", registerValidator(), uploadProfilePic, registerUser)
router.post("/register", uploadProfilePic, registerUser)

router.post("/login", loginValidator(), loginUser)

export default router; 