import multer from "multer";
import fs, { mkdir } from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join("./public/", "profile_image")

        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        cb(null, uploadDir)
    },

    filename: (req, file, cb) => {
        const currentDate = new Date();
        const date = currentDate.getDate().toString().padStart(2, "0")
        const month = ( currentDate.getMonth() + 1 ).toString().padStart(2, "0")
        const year = currentDate.getFullYear().toString()

        const filename = `${date}${month}${year}_${file.originalname}`

        cb(null, filename)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1000000 }, //1MB limit
    fileFilter: (req, file, cb) => {
        const filetype = /jpeg|jpg|png/;
        const mimetype = filetype.test(file.mimetype);
        const extname = filetype.test(path.extname(file.originalname).toLowerCase())

        if(mimetype && extname){
            return cb(null, true)
        }else{
            cb(new Error("Error: Image only"))
        }
    }
})

export default upload.single("profile_image")


// const uploadProfilePic = (req, res, next) => {
//     upload.single("profile_image")(req, res, next, (err) => {
//         if(err){
//             return res.status(400).json({status: false, message: "Failed to upload your image", error: err.message})
//         }
//         if(!req.file){
//             // return next()
//             return res.status(400).json({ status: false, message: "Profile image is required" });
//         }
//         const file = req.file;

//         const allowedTypes = ["image/jpg", "image/jpeg", "image/png"]

//         if(!allowedTypes.includes(file.mimetype)){
//             fs.unlinkSync(file.path)
//             return res.status(400).json({status:false, message: `Invalid file type: ${file.originalname}`})
//         }

//         req.file = file
//         next();
//     })
// }

// export default uploadProfilePic;