const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  otherName: [String],
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  email_confirmed: {
    type: Boolean,
    default: false
  },
  photo: String,
  facebookID: {
    type: String,
    // `facebook` must be unique, unless it isn't defined
    index: { unique: true, sparse: true }
  },
  facebook: String,
  twitter: String,
  instagram: String,
  role: {
    type: String,
    enum: ['user', 'support', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    // required: [true, 'Please provide a password'],
    // minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String
    // required: [true, 'Please confirm your password'],
    // validate: {
    //   // Custom Validator - This only works on CREATE and SAVE!!!
    //   validator: function(el) {
    //     return el === this.password;
    //   },
    //   message: 'Passwords are not the same!'
    // }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailConfirmToken: String,
  fbAccessToken: String,
  otherEmails: [
    {
      confirmed: {
        type: Boolean,
        default: false
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      token: String
    }
  ],

  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  points: {
    type: Number,
    default: 3
  },
  notifications: {
    type: Number,
    default: 0
  }
});

// Pre save middleware to hash password incase it was changed
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined; //passwordConfirm is required input but not required to be persistent in db
  next();
});

//Pre Save middleware if password was changed
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; //saving might need more time than issuing the token
  next();
});

//dont show inactive (deactivated) accounts

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Validate confirm password - returns boolean
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Parent Referencing Virtual populate for Crushes
userSchema.virtual('crushes', {
  ref: 'Crush',
  foreignField: 'sourceID', //name of reference field in Crushes model
  localField: '_id' //name of reference in local Model
});

//Boolean method to check if password changed since token created
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//Create a reset password token
userSchema.methods.createPasswordResetToken = function() {
  //create a token
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encrypt the token before saving it to database - send unencrypted to user
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  //save encrypted in DB and send user the unencrypted version
  return resetToken;
};
//Create a reset password token
userSchema.methods.createEmailConfirmToken = function() {
  //create a token
  const confirmToken = crypto.randomBytes(32).toString('hex');
  //encrypt the token before saving it to database - send unencrypted to user
  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  return confirmToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
