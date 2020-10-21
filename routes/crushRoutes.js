const express = require('express');
const router = express.Router();

const crushController = require('../controllers/crushController');
const reviewRouter = require('./reviewRoutes');
const authController = require('../controllers/authController');

// A Middleware that runs only when there is a parameter

router.param('id', crushController.checkID);

//Reviews middleware -mounting router not controller
// router.use('/:tourId/reviews', reviewRouter);

// Top 5 implementing Aliasing
router
  .route('/top-5')
  .get(crushController.aliasTop, crushController.getAllCrushes);

// Stats implementing aggregate
router.route('/stats').get(crushController.crushStats);

// Monthly Plan implementing aggregate Unwinding and Projecting

router
  .route('/plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    crushController.crushPlan
  );

router
  .route('/')
  .get(crushController.getAllCrushes)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    crushController.validateBody,
    crushController.createCrush
  );

router
  .route('/:id/:optional?')
  .get(crushController.getCrush)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    crushController.updateCrush
  )
  .delete(crushController.deleteCrush);

module.exports = router;
