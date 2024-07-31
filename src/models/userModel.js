import sequelize from "../config/db.config.js"
import { DataTypes, Sequelize} from "sequelize";

const User = sequelize.define("user", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_image: {
        type: DataTypes.STRING
    },
},  {
        timestamps: true,
        modelName:"user"
    }
)

export default User;