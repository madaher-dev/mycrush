const express = require('express');
const router = express.Router();

const crushController = require('../controllers/crushController');
const authController = require('../controllers/authController');

// // A Middleware that runs only when there is a parameter

// router.param('id', crushController.checkID);

// Stats implementing aggregate
router
  .route('/stats')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'support'),
    crushController.crushStats
  );

// Monthly Plan implementing aggregate Unwinding and Projecting

// router
//   .route('/plan/:year')
//   .get(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     crushController.crushPlan
//   );

// Get All Crushes - Create Crush
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'support'),
    crushController.getAllCrushes
  )
  .post(
    authController.protect,
    crushController.setSourceIds,
    crushController.checkSourceDup,
    crushController.checkPoints,
    crushController.checkUserExists,
    crushController.createCrush
  );

//Get All User's Crushes
router
  .route('/all')
  .get(authController.protect, crushController.getUserCrushes);

// Get - Update - Delete Crush by ID
router
  .route('/:id')
  .get(
    authController.protect,
    authController.privateCrush,
    crushController.getCrush
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'support'),
    crushController.updateCrush
  )
  .delete(
    authController.protect,
    authController.privateCrush,
    crushController.deleteCrush
  );

module.exports = router;
