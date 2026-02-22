import Message from "../models/contact.model.mjs";

export const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};