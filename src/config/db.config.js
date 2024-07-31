import dotenv from "dotenv";
dotenv.config()
import { Sequelize } from "sequelize"


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect:"mysql",
    logging: false,
})

// sequelize.authenticate()
// .then(() => { console.log("Database connected... ")})
// .catch((error) => console.log("Error while connection to db=> ",error))

try{
    await sequelize.authenticate()
    console.log("Database connected... ")
}catch(error){
    console.log("Error while connection to db=> ",error)
}

export default sequelize;