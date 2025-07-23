const conversationModel = require("../models/conversation");
const messageModel = require("../models/message");

exports.addConversation = async (req, res) => {
  try {
    let senderId = req.user._id;
    let { recieverId, message } = req.body;
    const isConvExist = await conversationModel.findOne({
      members: { $all: [senderId, recieverId] },
    });

    if (!isConvExist) {
      const newConversation = new conversationModel({
        members: [senderId, recieverId],
      });

      await newConversation.save();

      let addMessage = new messageModel({
        sender: req.user._id,
        conversation: newConversation._id,
        message,
      });
      await addMessage.save();
    } else {
      let addMessage = new messageModel({
        sender: req.user._id,
        conversation: isConvExist._id,
        message,
      });
      await addMessage.save();
    }
    return res.status(201).json({ message: "message sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ==============================================================================================================

exports.getConversation = async (req, res) => {
  try {
    let loggedinId = req.user._id;
    let conversations = await conversationModel
      .find({
        members: { $in: [loggedinId] },
      })
      .populate("members", "-password")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "fetched successfully", conversations: conversations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};
