const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./database/connection");
const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/chat-api/conversation", conversationRouter);
app.use("/chat-api/messages", messageRouter);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
