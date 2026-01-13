import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessages,
  likeMessage,
  addComment
} from "../controllers/message.controller.mjs";

const router = express.Router();

router.post("/", createMessage);
router.get("/", getMessages);
router.post("/:id/like", likeMessage);
router.delete('/:id', deleteMessage);
router.post("/:id/comment", addComment);

export default router;
