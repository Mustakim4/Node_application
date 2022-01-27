const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email id is Already Present"],
  },
  password: {
       type: String,
       required: true,
       unique :true
  },
  gender:{
       type: String
  },
  status:{
       type:String
  }
});

// hashing the password
userSchema.pre("save", async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);    
  }
  next()
})

// new connection
const Register = new mongoose.model("Register", userSchema);
module.exports = Register;
