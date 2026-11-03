const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  cat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Cat'
  },
  application:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Application'
  },
  message:{
    type:String,
    required:true,
    maxLength:500,
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
    adress:{
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
