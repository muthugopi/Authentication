import { DataTypes } from "sequelize";
import sequelize from "../config/db.mjs";

const ActivityLog = sequelize.define("ActivityLog", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "ActivityLogs",
  timestamps: true,
});

export default ActivityLog;
