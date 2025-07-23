const express = require("express");
const route = express.Router();
const Authentication = require("../authentication/auth");
const messageController = require("../controller/message");


route.post('/' , Authentication.auth , messageController.sendMessage);
route.get('/:convId' , Authentication.auth , messageController.getMessage);














module.exports = route;