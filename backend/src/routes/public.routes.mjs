import { Router } from "express";
import User from "../models/user.model.mjs";
import { recordActivity, getAnalytics} from "../controllers/logs.controller.mjs";

const router = Router();

router.get("/count", async (req, res) => {
  try {
    const count = await User.count(); 
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/activity", recordActivity);
router.get("/activity", getAnalytics);

export default router;
