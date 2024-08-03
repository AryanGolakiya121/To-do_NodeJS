import express from "express";
import { registerUser, loginUser, verifyUser, forgotPassword, resetPassword, resendVerificationEmail } from "../../controllers/authController.js"
import { loginValidator, registerValidator } from "../../validators/userValidator.js";
import uploadProfilePic from "../../middleware/uploadProfile.js";

const router = express.Router();


// router.post("/register", registerValidator(), uploadProfilePic, registerUser)
router.post("/register", uploadProfilePic, registerUser)

router.post("/login", loginValidator(), loginUser)

router.get("/verify/:id/:token", verifyUser)

router.post("/resend-verification", resendVerificationEmail)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

export default router; 