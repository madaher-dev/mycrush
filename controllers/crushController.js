const AppError = require('../utils/appError');
const { Crush, Archive, Match } = require('./../models/crushModel');
const Notification = require('./../models/notificationsModel');
const User = require('./../models/userModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const sendEmail = require('../utils/email');

//CRUD
exports.getAllCrushes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Crush.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const filteredCrushes = await features.query;

  // Send responce
  res.status(200).json({
    status: 'success',
    data: {
      crushes: filteredCrushes
    }
  });
});

exports.setSourceIds = (req, res, next) => {
  req.body.sourceId = req.user;

  next();
};

exports.checkSourceDup = catchAsync(async (req, res, next) => {
  const user = req.user;
  //need to validate social media and pull IDs
  let { name, phone, email, twitter, instagram, facebook } = req.body;
  if (!name) name = 'empty';
  if (!phone) phone = 0;
  if (!email) email = 'empty';
  if (!twitter) twitter = 'empty';
  if (!instagram) instagram = 'empty';
  if (!facebook) facebook = 'empty';

  //FindOne returns null while find returns empty array
  const crushDup = await Crush.findOne().and([
    {
      $or: [
        { name },
        { email },
        { phone },
        { twitter },
        { instagram },
        { facebook }
      ]
    },
    { sourceId: user }
  ]);

  if (crushDup) {
    return next(new AppError('You already have a similar crush!', 404));
  }

  next();
});

exports.checkOwn = catchAsync(async (req, res, next) => {
  const user = req.user;
  //need to validate social media and pull IDs
  let { name, phone, email, twitter, instagram, facebook } = req.body;

  if (
    user.name === name ||
    user.phone === phone ||
    user.email === email ||
    user.twitter === twitter ||
    user.instagram === instagram ||
    user.facebook === facebook
  ) {
    return next(new AppError('Its nice to like yourself, but not here!', 404));
  }

  next();
});

// Calls Match after check found
const checkUserCrushes = catchAsync(async (req, res, next) => {
  const crushFound = await Crush.findOne({
    sourceId: req.userFound._id,
    targetId: req.user._id
  });

  if (crushFound) {
    //MATCH FOUND -- Add notification, send communication
    req.crushFound = crushFound._id;
    createMatch(req, res, next);
  } else {
    req.body.targetId = req.userFound;

    next();
  }
});

exports.checkUserExists = catchAsync(async (req, res, next) => {
  // Check if there is a user matching crush fields when user created

  let { name, phone, email, twitter, instagram, facebook } = req.body;
  if (!name) name = 'empty';
  if (!phone) phone = 0;
  if (!email) email = 'empty';
  if (!twitter) twitter = 'empty';
  if (!instagram) instagram = 'empty';
  if (!facebook) facebook = 'empty';

  //FindOne returns null while find returns empty array
  //Need to check if name , otherName, and phone are verified

  const userFound = await User.findOne({
    $or: [
      { name },
      { otherName: name },
      { email },
      { phone },
      { twitter },
      { instagram },
      { facebook }
    ]
  });

  if (userFound) {
    req.userFound = userFound;

    checkUserCrushes(req, res, next);
  } else next();
});

exports.checkPoints = (req, res, next) => {
  if (req.user.points < 1) {
    return next(
      new AppError('You do not have enough points to create this crush!', 404)
    );
  }
  next();
};

//Create Match if User Found and Match
const createMatch = catchAsync(async (req, res, next) => {
  let result = await Crush.findById(req.crushFound);

  result.match = true;
  result.matchedAt = Date.now();

  let match = await Match.create(result.toJSON());
  match = await match.populate('sourceId targetId').execPopulate();

  result.remove();

  await Notification.create({ user: req.userFound._id, notType: 'new-match' });
  const user = await User.findByIdAndUpdate(req.userFound._id, {
    $inc: { notifications: 1 }
  });

  constructEmail('new-match', user.email);
  const newPoints = req.user.points - 1;

  await User.findByIdAndUpdate(req.user._id, {
    points: newPoints
  });

  res.status(200).json({
    status: 'success',
    data: match
  });
});

//Create Crush and Deduct point
exports.createCrush = catchAsync(async (req, res, next) => {
  const crush = await Crush.create(req.body);

  const newPoints = req.user.points - 1;

  await User.findByIdAndUpdate(req.user._id, {
    points: newPoints
  });

  //crush.sourceId.points = crush.sourceId.points - 1;

  // Notify crush by email, phone , or social media
  req.crush = crush;
  next();
});

exports.getCrush = factory.getOne(Crush);

// exports.getAllCrushes = factory.getAll(Crush);

// exports.getCrush = factory.getOne(Crush, { path: 'reviews' }); //reviews is populate option

// exports.updateCrush = factory.updateOne(Crush);
// exports.deleteCrush = factory.deleteOne(Crush);

exports.getUserCrushes = catchAsync(async (req, res, next) => {
  const crushes = await Crush.find({ sourceId: req.user.id }).sort(
    '-createdAt'
  );
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: crushes.length,
    crushes
  });
});

exports.getUserMatches = catchAsync(async (req, res, next) => {
  const matches = await Match.find({
    $or: [{ sourceId: req.user.id }, { targetId: req.user.id }]
  }).sort('-matchedAt');

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: matches.length,
    matches
  });
});

exports.updateCrush = catchAsync(async (req, res, next) => {
  const crush = await Crush.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!crush) {
    return next(new AppError('No tour found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      crush
    }
  });
});

exports.deleteCrush = catchAsync(async (req, res, next) => {
  const crush = await Crush.findById(req.params.id, function(err, result) {
    let swap = new Archive(result.toJSON()); //or result.toObject
    /* you could set a new id
    swap._id = mongoose.Types.ObjectId()
    swap.isNew = true
    */

    result.remove();
    swap.save();
    // swap is now in a better place
  });

  if (!crush) {
    return next(new AppError('No tour found with that ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Crush Deleted'
  });
});

const sendNotification = type =>
  catchAsync(async (req, res, next) => {
    if (req.userFound) {
      await Notification.create({ user: req.userFound, notType: type });
      const user = await User.findByIdAndUpdate(req.userFound, {
        $inc: { notifications: 1 }
      });
      req.userFoundEmail = user.email;
    }
    next();
  });
exports.sendNotification = sendNotification;

const sendCommunication = type =>
  catchAsync(async (req, res, next) => {
    if (type === 'new-crush') {
      if (req.userFoundEmail) {
        constructEmail('new-crush', req.userFoundEmail);
      } else if (req.crush.email) {
        constructEmail('new-crush', req.crush.email);
      }
    } else if (type === 'new-match') {
      constructEmail('new-match', req.userFoundEmail);
    }
    next();
  });
exports.sendCommunication = sendCommunication;
// Finally Send create crush result
exports.sendResult = (req, res) => {
  const crush = req.crush;

  res.status(201).json({
    status: 'success',
    data: crush
  });
};

const constructEmail = catchAsync(async (type, email) => {
  // const URL = `${req.protocol}://${req.get('host')}/`;

  const URL = `https://www.mycrush.ws`;

  if (type === 'new-crush') {
    const message = `Something is cooking! Someone seems to have a crush on you. Visit ${URL} , add a new crush and try to match with your secret admirer. Happy matching!`;

    const html_message = `<p> Something is cooking! Someone seems to have a crush on you. Visit ${URL} , add a new crush and try to match with your secret admirer. Happy matching!</p>`;

    try {
      await sendEmail({
        email,
        subject: 'Someone has a Crush on you!',
        message,
        html_message
      });
    } catch (err) {
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  } else if (type === 'new-match') {
    const message = `Hooray! You have a new match on MyCrush. Visit ${URL} to find out who it is. Happy Matching!`;

    const html_message = `<p> Hooray! You have a new match on MyCrush. Visit ${URL} to find out who it is. Happy Matching!</p>`;

    try {
      await sendEmail({
        email,
        subject: `It's a Match!`,
        message,
        html_message
      });
    } catch (err) {
      return next(
        new AppError('There was an error sending the email. Try again later!'),
        500
      );
    }
  }
});
