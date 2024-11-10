const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const loanApplicationSchema = new mongoose.Schema({
    applicationId: { type: String, default: uuidv4 },
    farmerId: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    applicationDate: { type: Date, required: true },
    loanPurpose: { type: String },
    interestRate: { type: Number, min: 0, max: 100 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], required: true }
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
