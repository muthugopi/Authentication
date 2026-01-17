import { Router } from "express";

import { authorize } from "../middlewares/authorize.middleware.mjs";
import { usersData } from "../controllers/user.controller.mjs";

const router = Router();

router.get('/users', authorize('admin'), usersData);

export default router