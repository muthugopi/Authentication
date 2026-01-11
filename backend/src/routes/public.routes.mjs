import { Router } from "express";
import User from "../models/user.model.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const count = await User.count();
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
