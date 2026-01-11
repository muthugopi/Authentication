import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  likeMessage,
} from "../controllers/message.controller.mjs";

const router = express.Router();

router.post("/", createMessage);
router.get("/", getMessages);
router.post("/:id/like", likeMessage);
router.delete('/:id', deleteMessage);

export default router;
