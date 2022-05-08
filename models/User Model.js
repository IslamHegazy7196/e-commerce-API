const mongoose = require("mongoose");
const validator=require('validator')
const bcrypt=require('bcryptjs')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique:true,
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
UserSchema.pre('save',async function(){
  const salt =await bcrypt.genSalt(10)
  this.password=await bcrypt.hash(this.password,salt)
})
UserSchema.methods.comparePassword=async function(canditatePassword){
  const isMatch=await bcrypt.compare(canditatePassword,this.password)
  return isMatch
}
module.exports = mongoose.model("User", UserSchema);
