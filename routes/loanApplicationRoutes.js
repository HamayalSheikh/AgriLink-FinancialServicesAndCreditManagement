const express = require('express');
const loanApplicationController = require('../controllers/loanApplicationController');
const router = express.Router();

router.post('/', loanApplicationController.createLoanApplication);
router.get('/', loanApplicationController.getAllLoanApplications);
router.get('/:id', loanApplicationController.getLoanApplicationById);
router.put('/:id', loanApplicationController.updateLoanApplication);
router.delete('/:id', loanApplicationController.deleteLoanApplication);
router.put('/:id', loanApplicationController.approveOrRejectLoan); 

module.exports = router;
