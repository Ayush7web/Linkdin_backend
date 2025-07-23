const express = require("express");
const route = express.Router();
const Authentication = require("../authentication/auth");
const CommentControllers = require("../controller/comment");


route.post("/", Authentication.auth, CommentControllers.commentPost);

route.get("/:postId", CommentControllers.getCommentByPostId);



module.exports = route;