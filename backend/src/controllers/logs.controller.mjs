import jwt from "jsonwebtoken";
import ActivityLog from "../models/activityLog.model.mjs";
import User from "../models/user.model.mjs";

export const recordActivity = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    await ActivityLog.create({
        name: decoded.name,
        activity: "Try to login admin panel!"
    });

    return res.json({ message: "illegal activity recorded !!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getAnalytics = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin")
      return res.status(403).json({ message: "Forbidden: Admins only" });

    const logs = await ActivityLog.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};