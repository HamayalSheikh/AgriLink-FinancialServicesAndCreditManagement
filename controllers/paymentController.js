const Payment = require('../models/Payment');
const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');
const { updateCreditScoreOnRepayment } = require('./CreditScoreController');
const stripe = require('../utils/stripe');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json({ message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Process a repayment
exports.processRepayment = async (req, res) => {
    try {
      const { repaymentId, status, amount } = req.body;
  
      const repayment = await LoanRepaymentMonitoring.findById(repaymentId);
      if (!repayment) return res.status(404).json({ message: 'Repayment not found.' });
  
      repayment.status = status;
      await repayment.save();
  
      await updateCreditScoreOnRepayment(repayment.userId, status, amount);
  
      res.json({ message: 'Repayment processed and credit score updated.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Function to handle the payment
exports.makePayment = async (req, res) => {
    try {
        const { amount, paymentMethodId } = req.body;
        // input validation 
        if (!amount || !paymentMethodId) {
            return res.status(400).json({ error: 'Amount and paymentMethodId are required' });
        }
        // create a new payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'pkr',
            payment_method: paymentMethodId,
            confirmation_method: 'automatic',  
            confirm: true,
        });

        const paymentStatus = paymentIntent.status === 'succeeded' ? 'completed' :
                              paymentIntent.status === 'pending' ? 'pending' : 'failed';
                              
        // record the payment to database 
        const payment = new Payment({
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount_received / 100,
            paymentMethod: paymentIntent.payment_method,
            paymentStatus: paymentStatus, 
            paymentDate: new Date(),
        });
        // save payment
        await payment.save();
        // respond with payment information
        return res.status(200).json({
            status: 'success',
            payment,
            message: 'Payment successful',
        });
    } catch(error) {
        console.error('Error during payment:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Payment failed',
            error: error.message,
        });
    }
};