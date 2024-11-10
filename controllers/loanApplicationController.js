const LoanApplication = require('../models/LoanApplication');

// Create a new loan application
exports.createLoanApplication = async (req, res) => {
    try {
        const loanApplication = new LoanApplication(req.body);
        await loanApplication.save();
        res.status(201).json(loanApplication);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all loan applications
exports.getAllLoanApplications = async (req, res) => {
    try {
        const applications = await LoanApplication.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a loan application by ID
exports.getLoanApplicationById = async (req, res) => {
    try {
        const application = await LoanApplication.findOne({ applicationId: req.params.id });
        if (!application) return res.status(404).json({ message: 'Loan application not found' });
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a loan application by ID
exports.updateLoanApplication = async (req, res) => {
    try {
        const application = await LoanApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!application) return res.status(404).json({ message: 'Loan application not found' });
        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a loan application by ID
exports.deleteLoanApplication = async (req, res) => {
    try {
        const application = await LoanApplication.findByIdAndDelete(req.params.id);
        if (!application) return res.status(404).json({ message: 'Loan application not found' });
        res.json({ message: 'Loan application deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};