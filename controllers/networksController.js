const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');
const sendSMS = require('./../utils/twilio');

exports.privateNetwork = catchAsync(async (req, res, next) => {
  if (req.user.type === 'admin' || req.user.type === 'support') next();
  else {
    const user = req.user.id;
    const network = req.body.emailId;

    const current = await User.findOne({
      _id: user,
      'otherEmails._id': network
    });

    if (!current) {
      return next(new AppError('You do not have access to this network!', 401));
    }

    next();
  }
});

exports.connectEmail = catchAsync(async (req, res, next) => {
  const newEmail = req.body.email;
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  const valid = validateEmail(newEmail);
  if (newEmail === req.user.email)
    return next(new AppError('Email already connected.', 400));
  else if (valid) {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, 'otherEmails.email': { $ne: newEmail } },
      {
        $push: {
          otherEmails: req.body
        }
      },
      { new: true }
    );

    if (user) {
      const confirmToken = crypto.randomBytes(32).toString('hex');

      function updateToken(emails, token) {
        for (var i in user.otherEmails) {
          if (user.otherEmails[i].email == emails) {
            user.otherEmails[i].token = token;
            break; //Stop this loop, we found it!
          }
        }
      }
      updateToken(newEmail, confirmToken);
      await user.save({ validateBeforeSave: false });

      // 3) Send it to user's email
      const confirmtURL = `${req.protocol}://${req.get(
        'host'
      )}/confirmnet/${confirmToken}`;
      const message =
        'Please click on the following link, or paste this into your browser to confirm your email:\n\n' +
        `${confirmtURL}.\n` +
        'If you did not connect this email on MyCrush please ignore this email!';

      const html_message =
        `<p> Please click on the following link, or paste this into your browser to confirm your email on :\n\n` +
        `<a href="${confirmtURL}">${confirmtURL}</a>\n` +
        `If you did not connect this email on MyCrush please ignore this email!</p>`;

      await sendEmail({
        email: newEmail,
        subject: 'Confirm your Email',
        message,
        html_message
      });

      res.status(201).json({
        status: 'success',
        data: {
          user
        }
      });
    } else {
      return next(new AppError('Email already connected.', 400));
    }
  } else {
    return next(new AppError('Please enter a valid email!', 400));
  }
});

exports.disconnectEmail = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { otherEmails: { _id: req.body.emailId } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError('No email found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.confirmNetwork = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { 'otherEmails.token': req.params.token },
    {
      $set: {
        'otherEmails.$.confirmed': true
      }
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError('Invalid token or email does not exist!', 401));
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }
});

exports.connectPhone = catchAsync(async (req, res, next) => {
  const newPhone = req.body.number;
  // console.log(newPhone);
  // console.log(req.user.id);
  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'phones.number': { $ne: newPhone } },
    {
      $push: {
        phones: req.body
      }
    },
    { new: true }
  );
  // console.log(user);
  if (user) {
    const confirmToken = Math.floor(100000 + Math.random() * 900000);

    function updateToken(phone, token) {
      for (var i in user.phones) {
        if (user.phones[i].number == phone) {
          user.phones[i].token = token;
          break; //Stop this loop, we found it!
        }
      }
    }
    updateToken(newPhone, confirmToken);
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's phone

    const message =
      'Please use the following code to confirm your phone number on MyCrush\n\n' +
      `${confirmToken}.\n` +
      'If you did not connect this number on MyCrush please ignore this sms!';

    const smsStatus = await sendSMS({
      number: newPhone,
      message
    });

    if (!smsStatus.success) {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { phones: { number: newPhone } }
      });
      return next(new AppError('SMS Sending failed!', 400));
    }
    user.points = user.points - 1;
    await user.save();
    //Remove token before sending to front end
    updateToken(newPhone, undefined);
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
  } else {
    return next(new AppError('Phone number already connected.', 400));
  }
});

exports.confirmPhone = catchAsync(async (req, res, next) => {
  console.log(req.params.token);
  const user = await User.findOneAndUpdate(
    { 'phones.token': req.params.token },
    {
      $set: {
        'phones.$.confirmed': true,
        'phones.$.token': null
      }
    },
    { new: true }
  );

  if (!user) {
    return next(new AppError('Invalid Validation Code!', 401));
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }
});

exports.disconnectPhone = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { phones: { _id: req.body.phoneID } } },
    { new: true }
  );

  if (!user) {
    return next(new AppError('No phone number found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
