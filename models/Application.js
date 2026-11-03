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
    maxLength:500
  },
  livingSituation:{
    type:String,
    required:true,
  },
  experienceWithCats:{
    type:Boolean,
    required:true,
  },
  status:{
    type:String,
    enum:['Accepted','Rejected'],
    default: 'Pending'
  }

}, {timestamps: true});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
