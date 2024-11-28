const express = require('express');
const { getCreditScore } = require('../controllers/CreditScoreController');
const router = express.Router();

router.get('/:userId', getCreditScore);

module.exports = router;
