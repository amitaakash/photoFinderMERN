const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const EmailHandler = require('../utils/email');
const ApiErrors = require('../utils/apiErrors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your address'],
    lowercase: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    minlength: [2, 'Name should be minimum length of 2'],
    maxlength: [40, 'Name should be minimum length of 40']
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'Role is either: user, guide, lead-guide or admin'
    },
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [8, 'password should be minimum 8 characters '],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please enter your confirmPassword'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: ' Confirm password must be same as password'
    },
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  activationToken: {
    type: String,
    select: false
  },
  activationTokenExpiry: Date,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordExpiresAt: Date,
  active: {
    type: Boolean,
    default: false
  },
  twoWayVerification: {
    type: Boolean,
    default: false
  },
  loginAttemptsCount: {
    type: Number,
    default: 0,
    select: false
  },
  activationUrl: String,
  wislistImages: [
    {
      type: String
    }
  ],
  wislistVideos: [
    {
      type: String
    }
  ]
});

// bcrypt Password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});
/* userSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  generateToten
  /* const token = crypto.randomBytes(32).toString('hex');
  this.activationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.activationTokenExpiry = Date.now() + 10 * 60 * 1000;
  next();
});
 */
userSchema.pre('save', async function(next) {
  console.log(this);
  if (!this.isNew) return next();
  const token = this.generateToken();
  this.activationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
  this.sendTokenMail(token, next);
  this.activationUrl = undefined;
  next();
});

userSchema.post('save', function(doc) {
  console.log(doc);
});

userSchema.methods.generateToken = function() {
  const token = crypto.randomBytes(32).toString('hex');

  //console.log({ resetToken }, this.passwordResetToken);
  return token;
};

userSchema.methods.sendTokenMail = async function(token, next) {
  try {
    const activateURL = `${this.activationUrl}${token}`;
    const message = `To activate your account!\nSubmit a PATCH request to to: ${activateURL}.\n`;
    await EmailHandler({
      email: this.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message
    });
  } catch (err) {
    console.log(err);
    return next(
      new ApiErrors(
        'There was an error to send email, please try again later!',
        500
      )
    );
  }
};

userSchema.methods.correctPassword = async function(
  currentPassword,
  userPassword
) {
  return await bcrypt.compare(currentPassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    //console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
