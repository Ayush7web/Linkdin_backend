const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  comment :{
    type : String,
    required : true
  },

}, {timeseries : true});

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
