const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    maxlength:20,
    minlength:5,
    trim:true
  },
  age:{
    type:Number,
    required:true,
    min:0
  },
  breed:{
    type:String,
    required:true,
    trim:true
  },
  gender:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
    trim:true
  },
  image:{
    type:String,
    default:''
  },
  isVaccinated:{
    type:Boolean,
    required:true
  },
  isNeutered:{
    type:Boolean,
    required:true
  },
  location:{
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
    enum:['Available','Adopted'],
    default:'Available'
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {timestamps: true});

const Cat = mongoose.model("Cat", catSchema);

module.exports = Cat;
