const express = require("express");
const Conversation = require("../models/Conversation");
const router = express.Router();

// create a new conversation
router.post("/", async (req, res) => {
  let duplicateConversation = false;
  const { customerEmail, serviceProviderEmail } = req.body;
  const newConversation = new Conversation({
    members: [customerEmail, serviceProviderEmail],
  });
  try {
    const conversationDocuments = await Conversation.find({
      members: { $in: [String(customerEmail)] },
    });
    //console.log("All conversations of this customer", conversationDocuments);
    for (const customerConversation of conversationDocuments) {
      const { members } = customerConversation;
      if (members.includes(serviceProviderEmail)) {
        console.log("Conversation already exists");
        duplicateConversation = true;
      }
    }
    if (duplicateConversation) {
      return res.status(400).json({ message: "Conversation already exists" });
    }
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

// get a conversation for a user
router.get("/:eventierUserEmail", async (req, res) => {
  const { eventierUserEmail } = req.params;
  if (!eventierUserEmail) {
    return res
      .status(412)
      .json({ message: "Please provide an Eventier User Id" });
  }

  try {
    const conversation = await Conversation.find({
      members: { $in: [String(eventierUserEmail)] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
