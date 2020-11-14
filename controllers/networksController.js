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

const jwt = require('jsonwebtoken');
const { labelSelf } = require('./authController');

var Twitter = require('twitter');

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
  // console.log(req.params.token);
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
  //const endpoint2_full = `https://api.twitter.com/1.1/account/verify_credentials.json?Name=Test&include_email=true&include_entities=false&skip_status=true`;
  const oauth_consumer_key = process.env.TWITTER_API_KEY;
  const oauth_consumer_secret = process.env.TWITTER_API_SECRET;
  const oauth_token = req.query.oauth_token;

  var requiredParameters = {
    oauth_consumer_key,
    oauth_nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp,
    oauth_token,
    oauth_version: '1.0'
  };

  const sorted_string = await sortString(requiredParameters, endpoint, 'POST');

  const signed = await signing(
    sorted_string,
    oauth_consumer_secret,
    oauth_token
  );

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
    // const response = await client2.post(endpoint, params2);
    const response = await axios(config);

    // var params = new URLSearchParams(response.data);
    // var token = params.get('oauth_token');

    const bodyString =
      '{ "' + response.data.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    const parsedBody = JSON.parse(bodyString);

    oauth_timestamp = Math.round(new Date().getTime() / 1000.0);

    nonceObj.update(Math.round(new Date().getTime() / 1000.0));
    oauth_nonce = nonceObj.getHash('HEX');

    requiredParameters.oauth_token = parsedBody.oauth_token;
    requiredParameters.oauth_timestamp = oauth_timestamp;
    requiredParameters.oauth_nonce = oauth_nonce;

    const params1 = {
      Name: 'Test',
      include_email: true
    };
    var client = new Twitter({
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_API_SECRET,
      access_token_key: parsedBody.oauth_token,
      access_token_secret: parsedBody.oauth_token_secret
    });

    const result = await client.get(endpoint2, params1);

    req.body.oauth_token = parsedBody.oauth_token;
    req.body.oauth_token_secret = parsedBody.oauth_token_secret;
    req.body.user_id = parsedBody.user_id;
    req.body.email = result.email;
    req.body.name = result.name;
    req.body.screen_name = result.screen_name;
    req.body.profile_image_url_https = result.profile_image_url_https;

    next();
    // res.send(JSON.parse(parsedBody));
  } catch (err) {
    console.log(err);
    next();
  }
});

exports.twitterAuth2 = catchAsync(async (req, res, next) => {
  var oauth_timestamp = Math.round(new Date().getTime() / 1000.0);
  const nonceObj = new jsSHA('SHA-1', 'TEXT', { encoding: 'UTF8' });
  nonceObj.update(Math.round(new Date().getTime() / 1000.0));
  var oauth_nonce = nonceObj.getHash('HEX');
  const endpoint = `https://api.twitter.com/oauth/access_token?oauth_verifier=${req.query.oauth_verifier}`;
  const endpoint2 = `https://api.twitter.com/1.1/account/verify_credentials.json`;
  //const endpoint2_full = `https://api.twitter.com/1.1/account/verify_credentials.json?Name=Test&include_email=true&include_entities=false&skip_status=true`;
  const oauth_consumer_key = process.env.ADMIN_TWITTER_API_KEY;
  const oauth_consumer_secret = process.env.ADMIN_TWITTER_API_SECRET;
  const oauth_token = req.query.oauth_token;

  var requiredParameters = {
    oauth_consumer_key,
    oauth_nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp,
    oauth_token,
    oauth_version: '1.0'
  };

  const sorted_string = await sortString(requiredParameters, endpoint, 'POST');

  const signed = await signing(
    sorted_string,
    oauth_consumer_secret,
    oauth_token
  );

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
    // const response = await client2.post(endpoint, params2);
    const response = await axios(config);

    // var params = new URLSearchParams(response.data);
    // var token = params.get('oauth_token');

    const bodyString =
      '{ "' + response.data.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    const parsedBody = JSON.parse(bodyString);

    oauth_timestamp = Math.round(new Date().getTime() / 1000.0);

    nonceObj.update(Math.round(new Date().getTime() / 1000.0));
    oauth_nonce = nonceObj.getHash('HEX');

    requiredParameters.oauth_token = parsedBody.oauth_token;
    requiredParameters.oauth_timestamp = oauth_timestamp;
    requiredParameters.oauth_nonce = oauth_nonce;

    const params1 = {
      Name: 'Test',
      include_email: true
    };
    var client = new Twitter({
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_API_SECRET,
      access_token_key: parsedBody.oauth_token,
      access_token_secret: parsedBody.oauth_token_secret
    });

    const result = await client.get(endpoint2, params1);

    req.body.oauth_token = parsedBody.oauth_token;
    req.body.oauth_token_secret = parsedBody.oauth_token_secret;
    req.body.user_id = parsedBody.user_id;
    req.body.email = result.email;
    req.body.name = result.name;
    req.body.screen_name = result.screen_name;
    req.body.profile_image_url_https = result.profile_image_url_https;
    console.log('Token:', parsedBody.oauth_token);
    console.log('Secret:', parsedBody.oauth_token_secret);
    console.log('leaving OAuth...');
    next();
    // res.send(JSON.parse(parsedBody));
  } catch (err) {
    console.log(err);
    next();
  }
});

exports.twitterAuthReverse = catchAsync(async (req, res, next) => {
  const callBackUL = encodeURIComponent(
    'https://mycrushapp.herokuapp.com/welcome'
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

  const signed = await signing(sorted_string, oauth_consumer_secret);

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

    // var params = new URLSearchParams(response.data);
    // var token = params.get('oauth_token');

    var jsonStr =
      '{ "' + response.data.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    // console.log(JSON.parse(jsonStr));
    res.send(JSON.parse(jsonStr));
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
    if (typeof consumer_secret !== 'undefined' && consumer_secret.length > 0) {
      if (!token) {
        secret = encodeURIComponent(consumer_secret) + '&';
      } else {
        secret =
          encodeURIComponent(consumer_secret) + '&' + encodeURIComponent(token);
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

exports.signupTwitter = catchAsync(async (req, res, next) => {
  if (req.body.status === 'not_authorized')
    return next(new AppError('Unuthorized twitter user!', 401));

  const connectedUser = await User.findOne({ twitterID: req.body.user_id });

  let newUser;
  if (!req.body.email && !connectedUser) {
    newUser = await User.findOneAndUpdate(
      { twitterID: req.body.user_id },
      {
        $set: {
          email: `${req.body.user_id}@twitter.com`,
          twitterID: req.body.user_id,
          email_confirmed: true,

          twitter: req.body.screen_name
        },

        $setOnInsert: {
          twitterAccessToken: req.body.oauth_token,
          twitterTokenSecret: req.body.oauth_token_secret,
          name: req.body.name,
          photo: req.body.profile_image_url_https,
          createdAt: Date.now()
        }
      },

      { upsert: true, new: true }
    );
    labelSelf(newUser);
  } else if (req.body.email && !connectedUser) {
    newUser = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          twitterID: req.body.user_id,
          email_confirmed: true,
          twitter: req.body.screen_name
        },
        $setOnInsert: {
          name: req.body.name,
          photo: req.body.profile_image_url_https,
          twitterAccessToken: req.body.oauth_token,
          twitterTokenSecret: req.body.oauth_token_secret,
          createdAt: Date.now()
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

  if (connectedUser) createSendToken(connectedUser, 201, req, res);
  else createSendToken(newUser, 201, req, res);
});

const createSendToken = (user, statusCode, req, res) => {
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

exports.disconnectTwitter = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { twitter: 1 },

      twitterID: null,
      twitterAccessToken: null,
      twitterTokenSecret: null
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

exports.connectTwitter = catchAsync(async (req, res, next) => {
  if (!req.user.photo) req.user.photo = req.body.profile_image_url_https;
  let user;

  if (req.user.email === req.body.email) {
    console.log('entered here');
    user = await User.findByIdAndUpdate(
      req.user._id,
      {
        photo: req.user.photo,
        twitterID: req.body.user_id,
        twitter: req.body.screen_name,
        twitterAccessToken: req.body.oauth_token,
        twitterTokenSecret: req.body.oauth_token_secret
      },
      { new: true }
    );
  } else {
    user = await User.findOneAndUpdate(
      { _id: req.user._id, 'otherEmails.email': { $ne: req.body.email } },
      {
        $set: {
          photo: req.user.photo,
          twitterID: req.body.user_id,
          twitter: req.body.screen_name,
          twitterAccessToken: req.body.oauth_token,
          twitterTokenSecret: req.body.oauth_token_secret
        }
      },
      { new: true }
    );
    user.otherEmails.push({ email: req.body.email, confirmed: true });
    user.save();
  }

  // Label self in all matching crushes - can be removed for reset password actions
  labelSelf(user);
  // newUser.password = undefined;
  res.status('200').json({
    status: 'success',
    user
  });
});
