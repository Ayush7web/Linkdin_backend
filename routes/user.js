const express = require("express");
const route = express.Router();
const userController = require("../controller/user");
const Authentication = require("../authentication/auth");

route.post("/register", userController.register);
route.post("/login", userController.login);
route.post("/google", userController.googleLogin);
route.put("/update", Authentication.auth, userController.updateUser);

route.get("/user/:id", userController.getProfileById);

route.post("/logout", Authentication.auth, userController.logout);

route.get("/self", Authentication.auth, (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

route.get("/findUser", Authentication.auth, userController.findUser);

route.post(
  "/sendFriendReq",
  Authentication.auth,
  userController.sendFriendRequest
);

route.post(
  "/acceptFriendRequest",
  Authentication.auth,
  userController.acceptFriendRequest
);

route.delete(
  "/removeFromFriendList/:friendId",
  Authentication.auth,
  userController.removeFromFriend
);

route.get("/friendsList", Authentication.auth, userController.getFriendsList);
route.get(
  "/pendingFriendsList",
  Authentication.auth,
  userController.getPendingFriendsList
);

module.exports = route;
