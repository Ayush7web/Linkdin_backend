const messageModel = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    let { conversation, message, picture } = req.body;
    let addMessage = new messageModel({
      sender: req.user._id,
      conversation,
      message,
      picture,
    });
    await addMessage.save();

    let populateMessage = await addMessage.populate("sender");
    return res.status(201).json(populateMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ===============================================================================================================

exports.getMessage = async (req, res) => {
  try {
    let { convId } = req.params;
    let message = await messageModel
      .find({
        conversation: convId,
      })
      .populate("sender");

    return res
      .status(200)
      .json({ message: "fetched message successfully", message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};
