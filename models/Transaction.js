const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, default: uuidv4 },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    transactionDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
