const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["friendRequest", "comment"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },

    postId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;
