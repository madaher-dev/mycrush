const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { labelSelf } = require('./authController');
const AppError = require('./../utils/appError');
const { findOneAndUpdate, findOne } = require('./../models/userModel');

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.status === 'not_authorized')
    return next(new AppError('Unuthorized facebook user!', 401));

  const connectedUser = await User.findOne({ facebookID: req.body.id });
  let newUser;
  if (!req.body.email && !connectedUser) {
    console.log('am here');
    newUser = await User.findOneAndUpdate(
      { facebookID: req.body.id },
      {
        $set: {
          //facebookID: req.body.id,
          email_confirmed: true
        },
        $setOnInsert: {
          name: req.body.name,
          email: `${req.body.id}@facebook.com`,
          photo: req.body.picture.data.url,
          facebook: req.body.link,
          fbAccessToken: req.body.accessToken,
          createdAt: Date.now()
        }
      },
      { upsert: true, new: true }
    );
    labelSelf(newUser);
  } else if (req.body.email && !connectedUser) {
    console.log('am there');
    newUser = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          facebookID: req.body.id,
          email_confirmed: true,
          photo: req.body.picture.data.url,
          facebook: req.body.link,
          fbAccessToken: req.body.accessToken
        },
        $setOnInsert: {
          createdAt: Date.now(),
          name: req.body.name,
          email: req.body.email
        }
      },
      { upsert: true, new: true }
    );
    labelSelf(newUser);
  }

  // console.log('created at:', newUser.createdAt);
  // let date = new Date();

  // const y = date.getTime();
  // const x = newUser.createdAt.getTime() + 100000;

  // if (x > y) labelSelf(newUser);
  console.log('yoohoo');
  createSendToken(newUser, 201, req, res);
});

exports.disconnect = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { facebookID: 1 },

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
  //const checkuser = await User.findById(req.params.id);
  if (req.user.email === req.body.email) {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          photo: req.body.picture.data.url,
          facebookID: req.body.id,
          facebook: req.body.link,
          fbAccessToken: req.body.accessToken
        }
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
      { _id: req.user._id, 'otherEmails.email': { $ne: req.body.email } },
      {
        $set: {
          photo: req.body.picture.data.url,
          facebookID: req.body.id,
          facebook: req.body.link,
          fbAccessToken: req.body.accessToken
        }
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

exports.insta = catchAsync(async (req, res, next) => {
  //check if facebook emails same

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      instagram: req.body.username
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
});

exports.instaDisconnect = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { instagram: 1 }
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
