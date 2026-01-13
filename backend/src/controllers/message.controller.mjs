import Message from "../models/message.model.mjs";
import jwt from "jsonwebtoken";


export const createMessage = async (req, res) => {
  try {
    const { title, content } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;

    if (!content) return res.status(400).json({ message: "Message required" });

    const msg = await Message.create({
      title,
      username: req.user.name,
      content,
    });

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
      //include: ["comments"], 
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
export const likeMessage = async (req, res) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ message: "Not found" });

    msg.likes += 1;
    await msg.save();

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await message.destroy();
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;

    if (!content) return res.status(400).json({ message: "Comment required" });

    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    const currentComments = msg.comments || [];
    const newComment = {
      id: Date.now(),
      username: req.user.name,
      content,
      createdAt: new Date(),
    };

    msg.comments = [...currentComments, newComment];
    await msg.save();

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
