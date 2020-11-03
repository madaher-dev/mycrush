const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { Crush } = require('./../models/crushModel');
const { labelSelf } = require('./authController');
const AppError = require('./../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.status === 'not_authorized')
    return next(new AppError('Unuthorized facebook user!', 401));
  const newUser = await User.findOneAndUpdate(
    { email: req.body.email },
    {
      name: req.body.name,
      email_confirmed: true,
      photo: req.body.picture.data.url,
      facebook: req.body.id,
      fbAccessToken: req.body.accessToken
    },
    { upsert: true, new: true }
  );
  // console.log(req.body.email);
  // console.log('created at', newUser.createdAt);
  // //console.log(newUser.createdAt.getTime());
  // let date = new Date();
  // console.log('date now', date);
  // //const y = date.setDate(date.getTime() + 10000);
  // const y = date.getTime();
  // const x = newUser.createdAt.getTime();
  // console.log;
  // console.log(y);
  // if (newUser.createdAt > date)

  labelSelf(newUser);

  createSendToken(newUser, 201, req, res);
});

exports.disconnect = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { facebook: req.params.id },
    {
      facebook: null,
      fbAccessToken: null
    },
    { new: true }
  );

  // Label self in all matching crushes - can be removed for reset password actions
  //UnlabelSelf(user);

  res.status('200').json({
    status: 'success',
    user
  });
});

exports.connect = catchAsync(async (req, res, next) => {
  //check if facebook emails same
  const checkuser = await User.findById(req.params.id);
  if (checkuser.email === req.body.email) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        photo: req.body.picture.data.url,
        facebook: req.body.id,
        fbAccessToken: req.body.accessToken
      },
      { new: true }
    );
    // Label self in all matching crushes - can be removed for reset password actions
    labelSelf(user);
    //newUser.password = undefined;

    res.status('200').json({
      status: 'success',
      user
    });
  } else {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, 'otherEmails.email': { $ne: req.body.email } },
      {
        photo: req.body.picture.data.url,
        facebook: req.body.id,
        fbAccessToken: req.body.accessToken
      },
      { new: true }
    );
    user.otherEmails.push({ email: req.body.email, confirmed: true });
    user.save();

    // Label self in all matching crushes - can be removed for reset password actions
    labelSelf(user);
    // newUser.password = undefined;
    res.status('200').json({
      status: 'success',
      user
    });
  }
});

const createSendToken = (user, statusCode, req, res) => {
  console.log('Signing Token');
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.SECURE_TOKEN === 'true') cookieOptions.secure = true;
  else cookieOptions.secure = false;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
