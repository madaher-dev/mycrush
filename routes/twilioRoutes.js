const express = require('express');

const router = express.Router();

const twilioController = require('../controllers/twilioController');

router.post('/verify', twilioController.verify);

module.exports = router;
