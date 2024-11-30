const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');
const LoanApplication = require('../models/LoanApplication');
const stripe = require('../utils/stripe');

// Create a new loan repayment monitoring entry
exports.createLoanRepayment = async (req, res) => {
    const { loanId, repaymentDate, amountPaid, customerId } = req.body;
    
    try {
        // find loan
        const loan = await LoanApplication.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        // create a repayment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountPaid * 100,
            currency: 'pkr',
            payment_method: paymentMethodId,
            customer: customerId,
            confirm: true,
        });
        // if payment is not successful
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment failed',
                error: paymentIntent.last_payment_error?.message || 'Unknown error occurred',
            });
        }
        loan.remainingBalance -= amountPaid;
        // loan completely paid
        if (loan.remainingBalance <= 0) {
            loan.remainingBalance = 0;
            loan.status = 'completed';
        }
        await loan.save();

        // saving repayment 
        const repayment = new LoanRepaymentMonitoring({
            monitoringId: paymentIntent.id,
            loanId,
            repaymentDate: repaymentDate || new Date(),
            amountPaid,
            remainingBalance: loan.remainingBalance,
            status: 'completed',
        });
        await repayment.save();

        res.status(201).json({
            success: true,
            message: 'Loan repayment processed successfully',
            repayment,
            loan,
        });
    } catch (error) {
        console.error('Repayment error:', error);
        res.status(500).json({
            success: false,
            message: 'Repayment processing failed',
            error: error.message,
        });
    }
};

// Retrieve all loan repayments
exports.getAllLoanRepayments = async (req, res) => {
    try {
        const repayments = await LoanRepaymentMonitoring.find();
        res.json(repayments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a loan repayment by ID
exports.getLoanRepaymentById = async (req, res) => {
    try {
        const repayment = await LoanRepaymentMonitoring.findById(req.params.id);
        if (!repayment) return res.status(404).json({ message: 'Loan repayment not found' });
        res.json(repayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a loan repayment by ID
exports.updateLoanRepayment = async (req, res) => {
    try {
        // Find and update the repayment entry
        const repayment = await LoanRepaymentMonitoring.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!repayment) {
            return res.status(404).json({ message: 'Loan repayment not found' });
        }

        // Find the associated loan application
        const loan = await LoanApplication.findById(repayment.loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Associated loan application not found' });
        }

        // Update the loan's remaining balance
        loan.remainingBalance -= repayment.amountPaid;

        // Check if the loan is fully repaid
        if (loan.remainingBalance <= 0) {
            loan.remainingBalance = 0; // Ensure it doesn't go negative
            loan.status = 'completed'; // Mark loan as completed
        }

        // Save the updated loan application
        await loan.save();

        res.json({ repayment, loan });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a loan repayment by ID
exports.deleteLoanRepayment = async (req, res) => {
    try {
        const repayment = await LoanRepaymentMonitoring.findByIdAndDelete(req.params.id);
        if (!repayment) return res.status(404).json({ message: 'Loan repayment not found' });
        res.json({ message: 'Loan repayment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
