import express from "express";
import { register, login, profile } from "../controllers/auth.controller.mjs";
import passport from "../utils/passport.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";

const router = express.Router();

// Public routes -> anyont can access it 
router.post("/register", register);
router.post('/login', login);


// Protected route -> only logined user can access it !
router.get("/profile",authMiddleware, profile);

export default router;
