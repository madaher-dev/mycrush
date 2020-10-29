const AppError = require('../utils/appError');
const { Crush, Archive, Match } = require('./../models/crushModel');
const User = require('./../models/userModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
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

  // const crushDup = await Crush.find({
  //   $and: [{ $or: [{ name }, { email },{ twitter }, { instagram }, { facebook }] }, { sourceId: user }]
  // });

  //const count = crushDup.length;

  // if (count !== 0) {
  if (crushDup) {
    return next(new AppError('You already have a similar crush!', 404));
  }

  next();
});

// Calls Match after check found
const checkUserCrushes = catchAsync(async (req, res, next) => {
  const crushFound = await Crush.findOne({
    sourceId: req.userFound,
    targetId: req.user
  });

  if (crushFound) {
    //MATCH FOUND
    req.crushFound = crushFound._id;
    createMatch(req, res, next);
  } else {
    req.body.targetId = req.userFound;
    //increment crushes
    //notify user
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

//Need to implement Match
const createMatch = catchAsync(async (req, res, next) => {
  await Crush.findById(req.crushFound, function(err, result) {
    let match = new Match(result.toJSON()); //or result.toObject
    /* you could set a new id
    swap._id = mongoose.Types.ObjectId()
    swap.isNew = true
    */

    result.remove();
    match.match = true;
    match.matchedAt = Date.now();
    match.save();
    // swap is now in a better place
    res.status(200).json({
      status: 'success',
      data: match
    });
  });
});

//Create Crush and Deduct point
exports.createCrush = catchAsync(async (req, res, next) => {
  const crush = await Crush.create(req.body);

  const newPoints = req.user.points - 1;

  await User.findByIdAndUpdate(req.user.id, {
    points: newPoints
  });

  crush.sourceId.points = crush.sourceId.points - 1;

  // Notify crush by email, phone , or social media

  res.status(201).json({
    status: 'success',
    data: crush
  });
});

exports.getAllCrushes = factory.getAll(Crush);

// exports.getCrush = factory.getOne(Crush, { path: 'reviews' }); //reviews is populate option
exports.getCrush = factory.getOne(Crush);
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

// Top 5 - Aliasing
exports.aliasTop = (req, res, next) => {
  //prefilling query string

  req.query.limit = 5; //choosing top 5
  req.query.sort = '-ratingsAverage,price'; //top 5 average sorted by price
  req.query.fields = 'name, price'; //show only certain fields
  next();
};

// validate middleware

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: 'fail',
      message: 'Missing fields in body'
    });
  }
  next();
};

//Aggregation Pipeline - ex: Statistics
exports.crushStats = catchAsync(async (req, res, next) => {
  const stats = await Crush.aggregate([
    //get all crushes grouped per target and sorted by number of followers
    {
      $match: { targetId: { $ne: null } }
    },
    {
      $group: {
        _id: { $toUpper: '$targetId' }, //Grouping , use null to disable
        numFollowers: { $sum: 1 } //calculate total crushes
        // numFollowers: { $sum: '$sourceId' } // otheroperators: $avg , $min, $max
      }
    },
    {
      $sort: { numFollowers: 1 } //sort by average price -1 for descending
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

// Aggregation pipeline Unwinding and Projecting
// How many tours there are in each month in a given year

exports.crushPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Crush.aggregate([
    {
      $unwind: '$startDates' //deconstruct an array field from the input document then output one document per array
    },
    {
      $match: {
        //match only tours in selected year
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' } //array of name of tours that fits criteria
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        //Removes the _id field
        _id: 0
      }
    },
    {
      $sort: { numToursStarts: -1 }
    },
    {
      $limit: 6 //limit to 6 results
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
