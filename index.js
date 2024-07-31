import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { privateRoutes, publicRoutes } from "./src/routes/indexRoute.js"
import { errorHandler } from "./src/middleware/errorMiddleware.js";

import sequelize from "./src/config/db.config.js";
import { handleValidatorMessage } from "./src/middleware/validatorMessage.js";
import { auth } from "./src/middleware/auth.js";

sequelize.sync({alter: true }).then(() => {
    console.log("re-sync-db");
}).catch((error) => {
    console.log("error while re-sync-db=> ",error);
})


const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


// app.use(
//     cors({
//         origin: "",
//         methods: "",
//         credentials: true
//     })
// )

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
    )
    next();
})

//Add auth 
app.all("/api/private/*", auth)

//use router
app.use("/api/public", publicRoutes)
app.use("/api/private", privateRoutes)

// app.use(errorHandler)
app.use(handleValidatorMessage)


const port = process.env.PORT || 4100

app.get("/", (req, res) => {
    res.status(200).json({status: true, message:"Server started successffully"})
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
