const AppError = require('../utils/appError');
const Crush = require('./../models/crushModel');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
//CRUD

exports.getAllCrushes = catchAsync(async (req, res, next) => {
  //127.0.0.1:8000/api/v1/crushes?sort=price,-duration&duration[gte]=5&difficulty=easy
  //-price for desending
  //,duration as a second sorting operator in case of tie

  const features = new APIFeatures(Crush.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const filteredCrushes = await features.query; //7ikmet rabina

  // Send responce
  res.status(200).json({
    status: 'success',
    data: {
      crushes: filteredCrushes
    }
  });
});

exports.createCrush = catchAsync(async (req, res, next) => {
  const newCrush = await Crush.create(req.body);
  res.status(201).json({
    status: 'success',
    timestamp: req.requestTime,
    data: {
      crush: newCrush
    }
  });
});

exports.getAllCrushes = factory.getAll(Crush);
exports.getCrush = factory.getOne(Crush, { path: 'reviews' }); //reviews is populate option
exports.createCrush = factory.createOne(Crush);
exports.updateCrush = factory.updateOne(Crush);
exports.deleteCrush = factory.deleteOne(Crush);

exports.updateCrush = catchAsync(async (req, res, next) => {
  const Crush = await Crush.findByIdAndUpdate(req.params.id, req.body, {
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
  const crush = await Crush.findByIdAndDelete(req.params.id);

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

// Check ID

const crushArray = [1, 2, 3, 4, 5, 6, 7];
exports.checkID = (req, res, next, val) => {
  console.log(`Crush ID is ${val}`);

  if (req.params.id * 1 > crushArray.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid crush ID'
    });
  }
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
    //get all crushes with rating above 4.3 and calculate the mathematical operations - can add multiple stages - can repeat stages
    {
      $match: { rating: { $gte: 4.3 } }
    },
    {
      $group: {
        _id: { $toUpper: '$name' }, //Grouping , use null to disable
        numCrushes: { $sum: 1 }, //calculate total results
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$rating' },
        avgPrice: { $avg: '$price' },
        mingPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 } //sort by average price -1 for descending
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
