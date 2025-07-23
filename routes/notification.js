const express = require("express");
const route = express.Router();
const Authentication = require("../authentication/auth");
const NotificationController = require("../controller/notification");

// get notification
route.get("/", Authentication.auth, NotificationController.getNotification);
route.put('/isRead', Authentication.auth , NotificationController.updateRead);
route.get('/activeNotification' , Authentication.auth , NotificationController.activeNotify);

module.exports = route;
