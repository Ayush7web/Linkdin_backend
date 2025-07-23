const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    members: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("conversation", conversationSchema);

module.exports = conversationModel;
