const User = require("../models/user");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const NotificationModal = require("../models/notification");

const cookieOption = {
  httpOnly: true,
  secure: false, //set to True in production
  sameSite: "Lax", // set None in production
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      aud: process.env.GOOGLE_CLIENT_ID,
    });
    const payload =  ticket.getPayload();

    const { sub, email, name, picture } = payload;

    let UserExist = await User.findOne({ email });
    if (!UserExist) {
      // register new user
      UserExist = await User.create({
        googleId: sub,
        email,
        f_name: name,
        profilePic: picture,
      });
    }

    let jwttoken = jwt.sign(
      { userId: UserExist._id },
      process.env.JWT_PRIVATE_KEY
    );
    res.cookie("token", jwttoken, cookieOption);
    return res.status(200).json({ user: UserExist });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ============================================================================================================

exports.register = async (req, res) => {
  console.log(req);
  try {
    let { email, password, f_name } = req.body;
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        error:
          "Already have an account with this email. please try with other email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashPassword, f_name });
    await newUser.save();
    return res.status(201).json({
      message: "user registered successfully",
      success: "yes",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ===========================================================================================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const UserExist = await User.findOne({ email });

    if (UserExist && bcrypt.compare(password, UserExist.password)) {
      let token = jwt.sign(
        { userId: UserExist._id },
        process.env.JWT_PRIVATE_KEY
      );
      res.cookie("token", token, cookieOption);

      return res.json({
        message: "login successfully hurray",
        success: true,
        UserExist,
      });
    } else {
      return res.status(400).json({ error: "invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { user } = req.body;
    const isExit = await User.findById(req.body.user._id);
    if (!isExit) {
      return res.status(400).json({ error: "user doesnot exist" });
    }

    const updateData = await User.findByIdAndUpdate(isExit._id.user);
    console.log(updateData);

    const userData = await User.findById(req.user._id);
    return res
      .status(200)
      .json({ message: "user updated successfully", user: userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const isExist = await User.findById(id);
    if (!isExist) {
      return res.status(400).json({ error: "the used is not find" });
    }
    return res
      .status(200)
      .json({ message: "user has already exist", user: isExist });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.logout = async (req, res) => {
  res
    .clearCookie("tooken", cookieOption)
    .json({ message: "logout user successfully" });
};

// ============================================================================================================

exports.findUser = async (req, res) => {
  try {
    let { query } = req.query;
    const user = await User.find({
      $and: [
        { id: { $ne: req.user._id } },
        {
          $or: [
            { name: { $regex: new RegExp(`^${query}`, "i") } },
            { email: { $regex: new RegExp(`^${query}`, "i") } },
          ],
        },
      ],
    });

    return res.status(201).json({ message: "fetched member", user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ===============================================================================================================

exports.sendFriendRequest = async (req, res) => {
  try {
    const sender = req.user._id;
    const { reciever } = req.body;

    const userExist = await User.findById(reciever);
    if (!userExist) {
      return res.status(400).json({ error: "no such user exist" });
    }

    const index = req.user.friends.findIndex((id) => id.equals(reciever));

    if (index !== -1) {
      res.status(400).json({ error: "already exist friends" });
    }

    const lastindex = userExist.pending_friends.findIndex((id) =>
      id.equals(req.user._id)
    );

    if (lastindex !== -1) {
      return res.status(400).json({ error: "Already send request" });
    }

    userExist.pending_friends.push(sender);
    let content = `${req.user.f_name} has sent you friend request`;
    const notification = new NotificationModal({
      sender,
      reciever,
      content,
      type: "friendRequest",
    });

    await notification.save();
    await userExist.save();
    res.status(200).json({ message: "friend request send" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// =========================================================================================================

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const selfId = req.user._id;

    const friendData = await User.findById(friendId);
    if (!friendData) {
      res.status(400).json({ error: "no such user exist" });
    }

    const index = req.user.pending_friends.findIndex((id) =>
      id.equals(friendId)
    );

    if (index == -1) {
      req.user.pending_friends.splice(index, 1);
    } else {
      return res.status(400).json({ error: "no any request from such user" });
    }

    req.user.friends.push(friendId);

    friendData.friends.push(req.user._id);

    let content = `${req.user.f_name} has accepted your friend request`;

    const notification = new NotificationModal({
      sender: req.user._id,
      reciever: friendId,
      content,
      type: "friend Request",
    });

    await notification.save();
    await friendData.save();
    await req.user.save();

    return res.status(200).json({ message: "you both are connected now" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.getFriendsList = async (req, res) => {
  try {
    let friendsList = await req.user.populate("friends");
    return res.status(200).json({ friends: friendsList.friends });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.getPendingFriendsList = async (req, res) => {
  try {
    let PendingFriendsList = await req.user.populate("pending_friends");
    return res
      .status(200)
      .json({ pendingFriends: PendingFriendsList.pendingFriends });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ==============================================================================================================

exports.removeFromFriend = async (req, res) => {
  try {
    let selfId = req.user._id;
    let { friendId } = req.params;

    const friendData = await User.findById(friendId);
    if (!friendData) {
      return res.status(400).json({ error: "no such user exist" });
    }

    const index = req.user.friends.findIndex((id) => id.equals(friendId));

    const friendIndex = friendData.friends.findIndex((id) => id.equals(selfId));

    if (index !== -1) {
      req.user.friends.splice(index, 1);
    } else {
      return res.status(400).json({ error: "no any request from such user" });
    }

    if (friendIndex !== -1) {
      friendData.friends.splice(friendIndex, 1);
    } else {
      return res.status(400).json({ error: "no any request from such user" });
    }

    await req.user.save();
    await friendData.save();

    return res.status(200).json({ message: "you both are disconnected now" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};
