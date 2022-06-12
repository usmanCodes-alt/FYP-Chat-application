const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

router.post("/", async (req, res) => {
  const { conversationId, eventierUserEmail, text } = req.body;
  if (!conversationId || !eventierUserEmail || !text) {
    return res
      .status(412)
      .json({ message: "Please provide all required fields" });
  }
  const newMessage = new Message({
    conversationId,
    senderEmail: eventierUserEmail,
    text,
  });

  try {
    const message = await newMessage.save();
    return res.status(201).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Fetch messages in a conversation
 */
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  if (!conversationId) {
    return res.status(412).json({ message: "Please provide conversation id" });
  }

  try {
    const messages = await Message.find({
      conversationId: conversationId,
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
