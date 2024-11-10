const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');

// Create a new loan repayment monitoring entry
exports.createLoanRepayment = async (req, res) => {
    try {
        const repayment = new LoanRepaymentMonitoring(req.body);
        await repayment.save();
        res.status(201).json(repayment);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        const repayment = await LoanRepaymentMonitoring.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!repayment) return res.status(404).json({ message: 'Loan repayment not found' });
        res.json(repayment);
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