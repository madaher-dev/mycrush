const express = require('express');
const router = express.Router();

const crushController = require('../controllers/crushController');
const authController = require('../controllers/authController');

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
    crushController.setSourceIds, //adds sourceID to the stack - can be removed
    crushController.checkSourceDup, //checks if user has crush with same entry
    crushController.checkPoints, // check if enough points
    crushController.checkUserExists, // check if crush in user DB - if exist check match
    crushController.createCrush //create crush
  );

//Get All User's Crushes
router
  .route('/all')
  .get(authController.protect, crushController.getUserCrushes);

//Get All User's Crushes
router
  .route('/matches')
  .get(authController.protect, crushController.getUserMatches);

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
