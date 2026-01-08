import express from "express";
import { register, login, profile, usersData } from "../controllers/auth.controller.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";
import { authorize } from "../middlewares/authorize.middleware.mjs";

const router = express.Router();

// Public routes -> anyont can access it 
router.post("/register", register);
router.post('/login', login);


// Protected route -> only logined user can access it !
router.get("/profile",authMiddleware, profile);

//roles 

router.get('/admin',authorize('admin'),usersData);

export default router;
