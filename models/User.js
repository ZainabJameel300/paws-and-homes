const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required: true,
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber:{
    type:String,
    required: true,
    unique: true,
    trim: true,
    min:8,
    max:8
  },
  profilePhoto:{
    type:String,
    default: ''
  }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
