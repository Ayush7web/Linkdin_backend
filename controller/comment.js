const commentModel = require("../models/comment");
const postModel = require("../models/post");
const { post } = require("../routes/comment");
const NotificationModal = require("../models/notification");

exports.commentPost = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.user._id;

    const postExist = await postModel.findById(postId).populate("user");

    if (!postExist) {
      return res.status(400).json({ error: "no such post found" });
    }
    postExist.comments = postExist.comments + 1;
    await postExist.save();

    const newComment = await commentModel({
      user: userId,
      post: postId,
      comment,
    });
    await newComment.save();

    const populateComment = await commentModel
      .findById(newComment._id)
      .populate("user", "f_name headline profilePic");

    const content = `${req.user.f_name} has commented on your post`;
    const notification = new NotificationModal({
      sender: userId,
      reciever: postExist.user._id,
      content,
      type: "comment",
      postId: postId.toString(),
    });

    await notification.save();
    return res
      .status(200)
      .json({ message: "comment successfully", comment: populateComment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

exports.getCommentByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostExist = await postModel.findById(postId);

    if (!isPostExist) {
      return res.status(400).json({ error: "no such post found" });
    }

    const comments = await commentModel
      .find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "f_name headline profile pic");

    return res
      .status(200)
      .json({ message: "fetched successfully", comments: comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};
