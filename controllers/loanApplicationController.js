const LoanApplication = require('../models/LoanApplication');
const CreditScore = require('../models/CreditScore');

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
        const application = await LoanApplication.findById(req.params.id);
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


// Approve or reject a loan application
exports.approveOrRejectLoan = async (req, res) => {
    try {
        const { status } = req.body; // Accepts 'approved' or 'rejected'
        const loanId = req.params.id;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Get the loan application details
        const application = await LoanApplication.findById(loanId);
        if (!application) return res.status(404).json({ message: 'Loan application not found' });

        // Check credit score before approval
        if (status === 'approved') {
            const creditScore = await CreditScore.findOne({ userId: application.userId });
            if (!creditScore || creditScore.score < 600) {
                return res.status(400).json({ message: 'Loan application denied due to low credit score.' });
            }
        }

        // Update loan application status
        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
