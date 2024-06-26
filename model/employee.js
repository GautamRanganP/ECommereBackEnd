const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeName:{
    type:String,
    required:true
  },
  employeeID:{
    type:Number,
    required:true
  },
  employeeEmail:{
    type:String,
  },
  completionDate:{
    type:Date,
  },
});

module.exports = mongoose.model("employee", employeeSchema);