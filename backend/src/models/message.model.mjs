import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Message = sequelize.define("Message", {
  username: {
    type: DataTypes.STRING,
    allowNull : false,
    defaultValue: "Anonymous",
  },
  content: {
    type: DataTypes.TEXT,
    allowNull : false,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Message;
