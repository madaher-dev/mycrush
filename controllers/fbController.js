const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { Crush } = require('./../models/crushModel');

exports.signup = catchAsync(async (req, res, next) => {
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

  // Label self in all matching crushes - can be removed for reset password actions
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
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; //works only if production is https

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

const labelSelf = catchAsync(async user => {
  let { name, email, phone, twitter, instagram, facebook } = user;

  if (!name) name = 'empty';
  if (!phone) phone = 0;
  if (!email) email = 'empty';
  if (!twitter) twitter = 'empty';
  if (!instagram) instagram = 'empty';
  if (!facebook) facebook = 'empty';

  await Crush.updateMany(
    {
      $or: [
        { name },
        { otherName: name },
        { email },
        { phone },
        { twitter },
        { instagram },
        { facebook }
      ]
    },
    { targetId: user.id }
  );
});

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
