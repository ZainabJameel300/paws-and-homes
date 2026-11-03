const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    maxLenght: 20,
    minLenght:5
  },
  age:{
    type:Number,
    required:true,
    min:0
  },
  breed:{
    type:String,
    required:true,
  },
  gender:{
    type:String,
    required:true,
    enum:['male','female']
  },
  description:{
    type:String,
    required:true
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
    adress:{
        type:String,
        required:true
    }

  },
  status:{
    type:String,
    enum:['Available','Adopted'],
    default:'Avaialbe'
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }


}, {timestamps: true});

const Cat = mongoose.model("Cat", catSchema);

module.exports = Cat;
