const express = require('express');
const router = express.Router();
const EscrowController = require('../controllers/escrowController');

// Routes for escrow functionality
router.post('/escrow/create', EscrowController.createEscrow);
router.put('/escrow/verify', EscrowController.verifyEscrowConditions);
router.put('/escrow/:transactionId/release', EscrowController.releaseEscrowFunds);

module.exports = router;
