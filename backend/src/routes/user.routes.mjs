import { Router } from "express";

import { changePassword, deleteUser, usersData } from "../controllers/user.controller.mjs";
import { authMiddleware } from "../middlewares/auth.middleware.mjs";
import { authorize } from "../middlewares/authorize.middleware.mjs";

const router = Router();

router.get('/users', authorize('admin'), usersData);
router.put('/users/change-password', authMiddleware,changePassword);
router.delete('/users/:id', authorize('admin'), deleteUser)

export default router