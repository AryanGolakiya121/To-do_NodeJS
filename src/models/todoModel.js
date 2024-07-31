import { todoStatus } from "../helper/enum.js";
import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";
import User from "./userModel.js";

const Todo = sequelize.define("todo", 
    {
        title: {
            type: DataTypes.STRING
        },
        status:{
            type: DataTypes.ENUM,
            values: Object.values(todoStatus)
        },
    },
    {
        timestamps: true
    }
)

User.hasMany(Todo, { foreignKey: "userId"} )
Todo.belongsTo(User, { foreignKey: "userId"} )

export default Todo;