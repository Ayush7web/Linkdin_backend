const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  f_name: {
    type: String,
    default: "",
  },
  headline: {
    type: String,
    default: "",
  },
  curr_company: {
    type: String,
    default: "",
  },
  curr_location: {
    type: String,
    default: "",
  },
  profilePic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSITIT4EV7YSWjaIPmneJmzmhbq1sDA9GVu2g&s",
  },

  coverPic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-0IlJoOev0yf_6D_PTCHmVi1lwBJKz1B4vg&s",
  },

  about: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: [
    {
      designation: {
        type: String,
        required: true,
      },
      company_name: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
      },
      location: {
        type: String,
        required: true,
      },
    },
  ],

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  pending_friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

  resume: {
    type : String
  }
}, {timestamps: true} );

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;