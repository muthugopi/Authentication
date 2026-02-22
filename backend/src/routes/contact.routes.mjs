import express from "express";
import { createMessage, getMessages } from "../controllers/contact.controller.mjs";
import { authorize } from "../middlewares/authorize.middleware.mjs";

const router = express.Router();

router.post("/", createMessage);  
router.get("/", authorize('admin') ,getMessages);   

export default router;