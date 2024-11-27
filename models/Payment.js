const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
    paymentId: { type: String, default: uuidv4 },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    escrow: { 
        type: Boolean, 
        default: true // Indicates the payment is held in escrow
      },
      escrowStatus: {
        type: String,
        enum: ['Pending', 'Released', 'Cancelled'], 
        default: 'Pending' // Tracks escrow state
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },  // Track changes
      escrowReleaseConditions: { // Conditions required to release the funds
        allPartiesConfirmed: { type: Boolean, default: false },
        transactionVerified: { type: Boolean, default: false }
      }
});

module.exports = mongoose.model('Payment', paymentSchema);
