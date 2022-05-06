const mongoose = require("mongoose");
const validator=require('validator')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide name"],
    validator:{
        validator:validator.isEmail,
        message:'please provide valid email'
    }
  },
  password: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 6,
  },
  role: {
    type: String,
    enum:['admin','user'],
    default:'user'
  },
});

module.exports = mongoose.model("User", UserSchema);
