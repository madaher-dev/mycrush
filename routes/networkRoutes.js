const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const networksController = require('../controllers/networksController');

router.get('/confirm/:token', networksController.confirmNetwork);

//Protect all routes after this middleware
router.use(authController.protect);

router.patch('/connectEmail', networksController.connectEmail);

// Delete Network by ID
router
  .route('/disconnectEmail')
  .patch(networksController.privateNetwork, networksController.disconnectEmail);
//.patch(networksController.privateNetwork, networksController.disconnectEmail);

module.exports = router;
