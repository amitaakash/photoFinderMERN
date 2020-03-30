const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const { promisify } = require('util');

const ApiErrors = require('../utils/apiErrors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const loginAttemptsCheck = async (user, count = 0) => {
  await User.findByIdAndUpdate(
    user._id,
    { loginAttemptsCount: count },
    { new: true, runValidators: false }
  );
};

const jwtTokenSign = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN}D`
  });
};

const createAndSendJWT = (user, res, statusCode) => {
  const token = jwtTokenSign(user._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development'
  });
  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      name: user.name,
      id: user._id,
      email: user.email,
      images: user.wislistImages,
      photo: user.photo
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body;

  const newUser = await User.create({
    email,
    name,
    password,
    confirmPassword,
    activationUrl: `${req.protocol}://${req.get('host')}/activate/`
  });

  res.status(201).json({
    status: 'success',
    message: 'Account Created! activation link sent to your email'
  });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    activationToken: hashedToken
  });
  if (!user) {
    return next(new ApiErrors('Invalid or expired token', 400));
  }
  // console.log(user);
  if (new Date(user.activationTokenExpiry).getTime() < Date.now()) {
    return next(new ApiErrors('expired', 400));
  }
  const updateData = {
    active: true,
    activationTokenExpiry: undefined,
    activationToken: undefined
  };

  await User.findOneAndUpdate({ _id: user._id }, updateData);

  console.log(
    new Date(user.activationTokenExpiry).getTime(),
    '------',
    Date.now()
  );
  res.status(200).json({
    status: 'success',
    message: 'done'
  });
});

exports.resendActivationToken = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // console.log(email);

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ApiErrors(`There is no user found with this ${email}`, 400)
    );
  }
  if (user.active) {
    return next(new ApiErrors(`Your acoount is already active`, 400));
  }
  user.activationUrl = `${req.protocol}://${req.get('host')}/activate/`;
  const activationToken = user.generateToken();
  user.sendTokenMail(activationToken, next);

  user.activationToken = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');
  user.activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
  user.activationUrl = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'activation link sent to your email'
  });
});

/* exports.logIn = catchAsync(async (req, res, next) => {
  

  // 3) if everything ok, send token to client
  createAndSendJWT(user._id, res, 201);
}); */

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    return next(new ApiErrors('Please provide email and password!', 401));
  }
  // 2) check if user exist and password is correct
  const user = await User.findOne({ email })
    .select('+password')
    .select('+loginAttemptsCount');
  if (!user) {
    return next(new ApiErrors('User does not exist', 401));
  }
  console.log(user);
  if (!user.active) {
    return next(
      new ApiErrors(
        'Your acount is not active, Please activate your account',
        401
      )
    );
  }
  if (user.loginAttemptsCount > process.env.LOGIN_ATTEMPTS) {
    return next(
      new ApiErrors(
        'You have exceeded maximum failed login attemps. Please use /forgotpassword',
        401
      )
    );
  }
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    const loginAttemptsCount = user.loginAttemptsCount + 1;
    await loginAttemptsCheck(user, loginAttemptsCount);
    return next(
      new ApiErrors('Email or password incorrect: Please try again', 401)
    );
  }
  await loginAttemptsCheck(user);

  // 3) if everything ok, send token to client
  createAndSendJWT(user, res, 201);
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Getting token from autorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiErrors('You are not logged in. Please login again!', 401)
    );
  }
  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new ApiErrors('This user no longer exist. Please sign up'));
  }

  // check user changed password after token issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiErrors('User recently changed password. Please login again!', 401)
    );
  }

  // grant access to all next routes,
  req.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  console.log(req.cookies.jwt);
  try {
    if (req.cookies.jwt) {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      console.log(decoded.id, decoded.iat);
      const loggedInUser = await User.findById(decoded.id);
      if (!loggedInUser) {
        return next();
      }
      if (loggedInUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      /* res.status(200).json({
        status: 'success',
        user: {
          name: loggedInUser.name,
          id: loggedInUser._id,
          email: loggedInUser.email,
          images: loggedInUser.wislistImages
        }
      }); */

      req.user = loggedInUser;
      console.log(loggedInUser);
      return next();
    }
  } catch (err) {
    return next();
  }
  // 1. Get token if exists

  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiErrors('You dont have permission to perform this action', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // get user based on email provided

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ApiErrors('There is no user exist: Please try again.', 404)
    );
  }
  //generate the random reset token
  user.activationUrl = `${req.protocol}://${req.get('host')}/resetpassword/`;
  const passwordResetToken = user.generateToken();
  user.sendTokenMail(passwordResetToken, next);

  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(passwordResetToken)
    .digest('hex');
  user.passwordExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  user.activationUrl = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Your password reset token is sent to your email'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  //Get user from reset token
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  if (!password && !confirmPassword && !resetToken) {
    return next(
      new ApiErrors(
        'Please provide password and confirmPassword with reset link',
        400
      )
    );
  }

  // check user exist and reset token is not expired
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordExpiresAt: { $gte: Date.now() }
  });

  if (!user) {
    return next(
      new ApiErrors(
        'Token is invalid or expired. Please use forgot password link ',
        400
      )
    );
  }

  // set new password  and save to database
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordExpiresAt = undefined;
  user.passwordResetToken = undefined;
  user.loginAttemptsCount = 0;
  await user.save();

  // send JWT token once password saved to database

  res.status(201).json({
    status: 'success',
    message: 'Your password has been changed successfully.'
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', { maxAge: 1000, httpOnly: true });
  res.status(200).json({ status: 'success' });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const loggedInUser = await User.findById({ _id: req.user.id }).select(
    '+password'
  );
  // 2. check if POSTed password is correct
  if (
    !(await loggedInUser.correctPassword(
      req.body.passwordCurrent,
      loggedInUser.password
    ))
  ) {
    return next(new ApiErrors('Your current password is wrong', 401));
  }
  // 3. if so, update Password
  loggedInUser.password = req.body.password;
  loggedInUser.passwordConfirm = req.body.passwordConfirm;
  await loggedInUser.save();
  //log user in , Reisue JWT
  res.status(201).json({
    status: 'success',
    message: 'Your password has been changed successfully.'
  });
});
