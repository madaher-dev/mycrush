const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');
const sendSMS = require('./../utils/twilio');
// const OAuth = require('oauth');
// const { promisify } = require('util');
var axios = require('axios');
const jsSHA = require('jssha/sha1');
//var passport = require('passport');
//var Strategy = require('passport-twitter').Strategy;
const { labelSelf } = require('./authController');

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

exports.checkPoints = (req, res, next) => {
  if (req.user.points < 2) {
    return next(
      new AppError('You do not have enough points to connect this phone!', 404)
    );
  }
  next();
};

exports.twitterAuth = catchAsync(async (req, res, next) => {
  var oauth_timestamp = Math.round(new Date().getTime() / 1000.0);
  const nonceObj = new jsSHA('SHA-1', 'TEXT', { encoding: 'UTF8' });
  nonceObj.update(Math.round(new Date().getTime() / 1000.0));
  var oauth_nonce = nonceObj.getHash('HEX');
  const endpoint = `https://api.twitter.com/oauth/access_token?oauth_verifier=${req.query.oauth_verifier}`;
  const endpoint2 = `https://api.twitter.com/1.1/account/verify_credentials.json`;
  const endpoint2_full = `https://api.twitter.com/1.1/account/verify_credentials.json?Name=Test&include_email=true&include_entities=false&skip_status=true`;
  const oauth_consumer_key = process.env.TWITTER_API_KEY;
  const oauth_consumer_secret = process.env.TWITTER_API_SECRET;
  const oauth_token = req.query.oauth_token;

  console.log('token:', req.query.oauth_token);
  console.log('verifier:', req.query.oauth_verifier);
  //oauth_consumer_key,
  // oauth_nonce,

  var requiredParameters = {
    oauth_consumer_key,
    oauth_nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp,
    oauth_token,
    oauth_version: '1.0'
  };

  const sorted_string = await sortString(requiredParameters, endpoint, 'POST');
  console.log(sorted_string);

  const signed = await signing(
    sorted_string,
    oauth_consumer_secret,
    oauth_token
  );
  //console.log(signed);
  var data = { oauth_verifier: req.query.oauth_verifier };
  var config = {
    method: 'post',
    url: endpoint,
    headers: {
      Authorization: `OAuth oauth_consumer_key=${process.env.TWITTER_API_KEY},oauth_nonce=${oauth_nonce},oauth_signature=${signed},oauth_signature_method="HMAC-SHA1",oauth_timestamp=${oauth_timestamp},oauth_token=${oauth_token},oauth_version="1.0"`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  };

  try {
    const response = await axios(config);

    // var params = new URLSearchParams(response.data);
    // var token = params.get('oauth_token');

    console.log('response:', response.data);

    const bodyString =
      '{ "' + response.data.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    const parsedBody = JSON.parse(bodyString);
    console.log(parsedBody);

    req.body['oauth_token'] = parsedBody.oauth_token;
    req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
    req.body['user_id'] = parsedBody.user_id;

    oauth_timestamp = Math.round(new Date().getTime() / 1000.0);

    nonceObj.update(Math.round(new Date().getTime() / 1000.0));
    oauth_nonce = nonceObj.getHash('HEX');

    requiredParameters.oauth_token = parsedBody.oauth_token;
    requiredParameters.oauth_timestamp = oauth_timestamp;
    requiredParameters.oauth_nonce = oauth_nonce;
    //console.log('parameters', requiredParameters);
    const sorted_string2 = await sortString(
      requiredParameters,
      endpoint2_full,
      'GET'
    );

    console.log('soreted string:', sorted_string2);
    const signed2 = await signing(
      sorted_string2,
      oauth_consumer_secret,
      parsedBody.oauth_token_secret
    );
    console.log('signature', signed2);

    var config2 = {
      method: 'get',
      url: endpoint2_full,
      headers: {
        Authorization: `OAuth oauth_consumer_key=${process.env.TWITTER_API_KEY},oauth_nonce=${oauth_nonce},oauth_signature=${signed2},oauth_signature_method="HMAC-SHA1",oauth_timestamp=${oauth_timestamp},oauth_token=${parsedBody.oauth_token},oauth_version="1.0"`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const response2 = await axios(config2);

    console.log(response2.data);

    next();
    // res.send(JSON.parse(parsedBody));
  } catch (err) {
    console.log(err.response);
    next();
  }
});

exports.twitterAuthReverse = catchAsync(async (req, res, next) => {
  //const callBackUL = 'https%3A%2F%2F127.0.0.1%3A3000%2Flogin';

  const callBackUL = encodeURIComponent(
    'https://mycrushapp.herokuapp.com/login'
  );
  var oauth_timestamp = Math.round(new Date().getTime() / 1000.0);
  const nonceObj = new jsSHA('SHA-1', 'TEXT', { encoding: 'UTF8' });
  nonceObj.update(Math.round(new Date().getTime() / 1000.0));
  const oauth_nonce = nonceObj.getHash('HEX');
  const endpoint = 'https://api.twitter.com/oauth/request_token';
  const oauth_consumer_key = process.env.TWITTER_API_KEY;
  const oauth_consumer_secret = process.env.TWITTER_API_SECRET;

  var requiredParameters = {
    oauth_callback: callBackUL,
    oauth_consumer_key,
    oauth_nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp,
    oauth_version: '1.0'
  };

  const sorted_string = await sortString(requiredParameters, endpoint, 'POST');
  console.log('Sorted string:', sorted_string);

  const signed = await signing(sorted_string, oauth_consumer_secret);
  console.log('signed:', signed);

  var data = {};
  var config = {
    method: 'post',
    url: endpoint,
    headers: {
      Authorization: `OAuth oauth_consumer_key=${process.env.TWITTER_API_KEY},oauth_nonce=${oauth_nonce},oauth_signature=${signed},oauth_signature_method="HMAC-SHA1",oauth_timestamp=${oauth_timestamp},oauth_version="1.0",oauth_callback=${callBackUL}`,
      'Content-Type': 'application/json'
    },
    data: data
  };
  try {
    const response = await axios(config);

    var params = new URLSearchParams(response.data);
    var token = params.get('oauth_token');

    console.log(token);

    var jsonStr =
      '{ "' + response.data.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    res.send(JSON.parse(jsonStr));

    // res.status('200').json({
    //   status: 'success',
    //   data: {
    //     body: token
    //   }
    // });
  } catch (err) {
    console.log(err.response.data);
    next();
  }
});

const sortString = async (requiredParameters, endpoint, type) => {
  var base_signature_string = `${type}&` + encodeURIComponent(endpoint) + '&';
  var requiredParameterKeys = Object.keys(requiredParameters);
  for (var i = 0; i < requiredParameterKeys.length; i++) {
    if (i == requiredParameterKeys.length - 1) {
      base_signature_string += encodeURIComponent(
        requiredParameterKeys[i] +
          '=' +
          requiredParameters[requiredParameterKeys[i]]
      );
    } else {
      base_signature_string += encodeURIComponent(
        requiredParameterKeys[i] +
          '=' +
          requiredParameters[requiredParameterKeys[i]] +
          '&'
      );
    }
  }
  return base_signature_string;
};

const signing = async (signature_string, consumer_secret, token) => {
  let hmac;
  let secret;
  if (typeof signature_string !== 'undefined' && signature_string.length > 0) {
    console.log('String OK');
    if (typeof consumer_secret !== 'undefined' && consumer_secret.length > 0) {
      console.log('Secret Ok');
      if (!token) {
        secret = encodeURIComponent(consumer_secret) + '&';
        console.log('No TOken');
      } else {
        secret =
          encodeURIComponent(consumer_secret) + '&' + encodeURIComponent(token);
        console.log('Token OK');
      }

      var shaObj = new jsSHA('SHA-1', 'TEXT', {
        hmacKey: { value: secret, format: 'TEXT' }
      });
      shaObj.update(signature_string);

      hmac = encodeURIComponent(shaObj.getHash('B64'));
    }
  }
  return hmac;
};

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.status === 'not_authorized')
    return next(new AppError('Unuthorized facebook user!', 401));

  let newUser;
  if (!req.body.email) {
    newUser = await User.findOneAndUpdate(
      { facebookID: req.body.id },
      {
        name: req.body.name,
        email: `${req.body.id}@facebook.com`,
        facebookID: req.body.id,
        email_confirmed: true,
        photo: req.body.picture.data.url,
        facebook: req.body.link,
        fbAccessToken: req.body.accessToken
      },
      { upsert: true, new: true }
    );
  } else {
    newUser = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        name: req.body.name,
        email: req.body.email,
        facebookID: req.body.id,
        email_confirmed: true,
        photo: req.body.picture.data.url,
        facebook: req.body.link,
        fbAccessToken: req.body.accessToken
      },
      { upsert: true, new: true }
    );
  }

  console.log('created at:', newUser.createdAt);
  let date = new Date();

  const y = date.getTime();
  const x = newUser.createdAt.getTime() + 100000;

  if (x > y) labelSelf(newUser);

  createSendToken(newUser, 201, req, res);
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
