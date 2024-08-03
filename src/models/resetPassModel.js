import { DataTypes } from "sequelize";
import sequelize from "../config/db.config.js";
import User from "./userModel.js";


const ResetPass = sequelize.define("reset_password", 
    {
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expires: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
)

User.hasMany(ResetPass, { foreignKey: "userId", onDelete: "CASCADE"})
ResetPass.belongsTo(User, { foreignKey: "userId"})


export default ResetPass;

