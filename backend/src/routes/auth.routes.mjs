import express from "express";
import { register, login, profile, usersData, checkAuth } from "../controllers/auth.controller.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";
import { authorize } from "../middlewares/authorize.middleware.mjs";
import { makeMeAdmin } from "../controllers/makeMeAdmin.controller.mjs";

const router = express.Router();

// Public routes -> anyont can access it 
router.post("/register", register);
router.post('/login', login);
router.get('/me', checkAuth)

// Protected route -> only logined user can access it !
router.get("/profile",authMiddleware, profile);

//change me before commit !!!
router.post('/beadmin', makeMeAdmin);
router.get('/admin',authorize('admin'),usersData);

export default router;
