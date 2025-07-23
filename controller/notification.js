const notificationModel = require("../models/notification");


exports.getNotification = async (req, res) => {
  try {
    const ownId = req.user._id;
    const notifications = await NotificationModal.find({ reciever: ownId })
      .sort({ createdAt: -1 })
      .populate("sender reciever");
    return res.status(200).json({
      message: "notification fetched successfully",
      notifications: notifications,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};

// ===========================================================================================================

exports.updateRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true }
    );

    if (!notification) {
      return res.status(400).json({ error: "notification not found" });
    }
    return res.status(200).json({ message: "read notification" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
};


// ===========================================================================================================

exports.activeNotify = async(req, res) => {
  try {
    let ownId = req.user._id;
    let notifications = await NotificationModal.find({reciever : ownId , isRead : false});
    return res.status(400).json({message:"notification number fetched successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error", message: err.message });
  }
}