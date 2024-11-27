const Transaction = require('../models/Transaction');

// Create a transaction and a corresponding payment
exports.createTransaction = async (req, res) => {
    try {
      const { buyerId, sellerId, productId, quantity, totalPrice, transactionDate, status } = req.body;
  
      // Create and save the transaction
      const transaction = new Transaction({
        buyerId,
        sellerId,
        productId,
        quantity,
        totalPrice,
        transactionDate,
        status
      });
  
      await transaction.save();
  
      // Create and save the corresponding payment
      const payment = new Payment({
        transactionId: transaction.transactionId,  // Reference the transactionId here
        amount: totalPrice,  // Payment amount
        paymentStatus: 'pending',  // Initial status
        paymentDate: transactionDate,
        paymentMethod: 'credit card'  // Example method
      });
  
      await payment.save();
  
      res.status(201).json({ transaction, payment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// Retrieve all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve a transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Confirm a transaction
exports.confirmTransaction = async (req, res) => {
    try {
      const { transactionId } = req.body;
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      transaction.status = 'completed';
      await transaction.save();
  
      res.status(200).json({ message: 'Transaction confirmed', transaction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};