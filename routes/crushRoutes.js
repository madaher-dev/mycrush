const express = require('express');
const router = express.Router();

const crushController = require('../controllers/crushController');
const authController = require('../controllers/authController');

// Get All Crushes - Create Crush
router
  .route('/')
  //Will be used for admin
  .get(
    authController.protect,
    authController.restrictTo('admin', 'support'),
    crushController.getAllCrushes
  )
  .post(
    authController.protect,
    crushController.setSourceIds, //adds sourceID to the stack - can be removed
    crushController.checkOwn, // check if adding own networks
    crushController.checkSourceDup, //checks if user has crush with same entry
    crushController.checkPoints, // check if enough points
    crushController.checkUserExists, // check if crush in user DB - if exist check match -match will send notification and communication
    crushController.createCrush, //create crush
    crushController.sendNotification('new-crush'), //if user exists send notification
    crushController.sendCommunication('new-crush'), // send communication to users and to potential
    crushController.sendResult // send request result to user
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
