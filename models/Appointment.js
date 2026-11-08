const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  application:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Application',
    unique:true
  },
  message:{
    type:String,
    required:true,
    maxlength:500,
    trim:true
  },
  dateOfPickup:{
    type:Date,
    required:true
  },
  pickUpLocation:{
    latitude:{
        type:Number,
        required:true
    },
    longitude:{
       type:Number,
       required:true 
    },
    address:{
        type:String,
        required:true
    }
  },
  status:{
    type:String,
    enum:['Completed','Cancelled'],
    default:null
  }

}, {timestamps: true});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
