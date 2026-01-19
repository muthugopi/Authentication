import express from "express";
import { register, login,  checkAuth } from "../controllers/auth.controller.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";
import { makeMeAdmin, makeUserModerator} from "../controllers/makeMeAdmin.controller.mjs";
import { authorize } from "../middlewares/authorize.middleware.mjs";

const router = express.Router();

// Public routes -> anyont can access it 
router.post("/register", register);
router.post('/login', login);
router.get('/me', checkAuth)


//change me before commit !!!
router.post('/beadmin', makeMeAdmin);
router.post('/bemoderator', authorize('admin'),makeUserModerator);

export default router;
