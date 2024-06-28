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
    required: true
  },
  certifications: [{
    name: {
        type: String,
        required: true
    },
    completionDate:{
        type: Date,
        required: true
    }
  }]
});

module.exports = mongoose.model("employee", employeeSchema);