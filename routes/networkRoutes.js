const express = require('express');
const bodyParser = require('body-parser');

// const pino = require('express-pino-logger')();

const router = express.Router();

const authController = require('../controllers/authController');
const networksController = require('../controllers/networksController');

router.post(
  '/twitter',
  networksController.twitterAuth,
  networksController.signupTwitter
);

//router.post('/twitter2', networksController.twitterAuth2);

router.post('/twitter/reverse', networksController.twitterAuthReverse);

router.get('/confirm/:token', networksController.confirmNetwork);

//Protect all routes after this middleware
router.use(authController.protect);

router.post(
  '/twitter/connect',
  networksController.twitterAuth,
  networksController.connectTwitter
);

router.get('/twitter/disconnect', networksController.disconnectTwitter);

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
