import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const Message = sequelize.define("Message", {
  username: {
    type: DataTypes.STRING,
    allowNull : false,
    defaultValue: "Anonymous",
  },
  title : {
    type : DataTypes.STRING,
    allowNull : false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull : false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  comments: {
  type: DataTypes.JSON,
  defaultValue: [],
},

});

export default Message;
