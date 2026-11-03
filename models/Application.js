const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  cat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Cat'
  },
  applicant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  message:{
    type:String,
    required:true,
    maxlength:500,
    trim:true
  },
  livingSituation:{
    type:String,
    required:true,
    trim:true
  },
  experienceWithCats:{
    type:Boolean,
    required:true,
  },
  status:{
    type:String,
    enum:['Pending','Accepted','Rejected'],
    default: 'Pending'
  }

}, {timestamps: true});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
