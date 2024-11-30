const express = require('express');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);
router.post('/repay', paymentController.processRepayment);
router.post('/make-payment', paymentController.makePayment);

module.exports = router;
