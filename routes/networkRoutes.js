const express = require('express');
const bodyParser = require('body-parser');

// const pino = require('express-pino-logger')();

const router = express.Router();

const authController = require('../controllers/authController');
const networksController = require('../controllers/networksController');

router.get('/twitter', networksController.twitterAuth);
router.post('/twitter/reverse', networksController.twitterAuthReverse);
router.get('/confirm/:token', networksController.confirmNetwork);

//Protect all routes after this middleware
router.use(authController.protect);

router.patch('/connectEmail', networksController.connectEmail);
router.patch(
  '/connectPhone',
  networksController.checkPoints,
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  // pino,
  networksController.connectPhone
);
router.get('/validatePhone/:token', networksController.confirmPhone);
router.patch(
  '/disconnectPhone',

  networksController.disconnectPhone
);

// Delete Network by ID
router
  .route('/disconnectEmail')
  .patch(networksController.privateNetwork, networksController.disconnectEmail);

//.patch(networksController.privateNetwork, networksController.disconnectEmail);

module.exports = router;
