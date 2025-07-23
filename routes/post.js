const express = require("express");
const route = express.Router();
const Authentication = require("../authentication/auth");
const PostController = require("../controller/post");

route.post("/", Authentication.auth, PostController.addPost);
route.post("/likeDislike", Authentication.auth, PostController.likeDislikePost);
route.get("/getAllPost" , PostController.getAllPost);
route.get("/getPostById/:postId" , PostController.getPostByPostId);
route.get("/getTop5Post/:postId" , PostController.getTop5PostForUser);
route.get("/getAllPostForUser", PostController.getAllPostForUser);

module.exports = route;