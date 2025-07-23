const express = require("express");
const route = express.Router();
const Authentication = require("../authentication/auth");
const conversationController = require("../controller/conversation");

route.post(
  "/add-conversation",
  Authentication.auth,
  conversationController.addConversation
);

route.get(
  "/get-conversation",
  Authentication.auth,
  conversationController.getConversation
);



module.exports = route;
