const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
    set: (val) => (val ? bcrypt.hashSync(val) : val),
  },
  mobileNumber: {
    type: String,
    maxlength: 15,
    required: true,
  },
},
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});



const User = mongoose.model("user", userSchema);

module.exports = User;