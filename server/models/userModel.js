const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    minlength: [3, "Name must be at least 3 characters long"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please provide your email address"],
    unique: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },
  rollNo: {
    type: String,
     unique: true,
    trim: true,
    minlength: 3,
  },
  
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlenght: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  
  phone: {
    type: String,
    required: [true, "Please provide your phone number!"],
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.passwordCorrect = async function (
  candiatePassword,
  userPassword
) {
  return await bcrypt.compare(candiatePassword, userPassword);
};
userSchema.pre("save", function (next) {
  // Only run this function if rollNo is not already set (new user)
  if (this.rollNo) return next();
  
  // Extract the email's local part (before @)
  const email = this.email;
  const localPart = email.split('@')[0];
  
  // Check if this is a student email (pattern: name+year+branch+number)
  const studentEmailRegex = /^[a-z]+(\d{2})([a-z]+)(\d+)@iiitkottayam\.ac\.in$/;
  const match = email.match(studentEmailRegex);
  
  if (match) {
    // For student emails like sanjay23bcy51@iiitkottayam.ac.in
    const year = match[1];
    const branch = match[2];
    const number = match[3];
    
    // Pad the number to 4 digits
    const paddedNumber = number.padStart(4, '0');
    
    // Create roll number in format 20YYbcyNNNN
    this.rollNo = `20${year}${branch}${paddedNumber}`;
  } else {
    // For non-standard emails, generate based on date
    const now = new Date();
    const year = now.getFullYear();
    
    // Get month name
    const months = ["january", "february", "march", "april", "may", "june",
                    "july", "august", "september", "october", "november", "december"];
    const month = months[now.getMonth()];
    
    // Extract name from email (assuming format: name@domain)
    const name = email.split('@')[0];
    
    // Create roll number in format YYYYmonthname
    this.rollNo = `${year}${month}${name}`;
  }
  
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimeStamp > JWTTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;