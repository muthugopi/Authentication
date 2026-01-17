import express from "express";
import { register, login,  checkAuth } from "../controllers/auth.controller.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";
import { makeMeAdmin } from "../controllers/makeMeAdmin.controller.mjs";

const router = express.Router();

// Public routes -> anyont can access it 
router.post("/register", register);
router.post('/login', login);
router.get('/me', checkAuth)


//change me before commit !!!
router.post('/beadmin', makeMeAdmin);

export default router;
