const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.DB_SERVICE_URL;

// Create a transaction and a corresponding payment
exports.createTransaction = async (req, res) => {
    try {
        const { buyerId, sellerId, productId, quantity, totalPrice, transactionDate, status } = req.body;

        // Create the transaction in the central microservice
        const transactionResponse = await axios.post(`${BASE_URL}/transactions`, {
            buyer: buyerId,
            seller: sellerId,
            product: productId,
            quantity: quantity,
            totalPrice: totalPrice,
            status: status,
        });

        console.log(transactionResponse.data);
        
        const transaction = transactionResponse.data;

        console.log("Transaction: ", transaction);

        console.log(
            "Transaction ID: ", transaction._id,
            "Amount: ", totalPrice,
            "Payment Status: ", 'pending',
            "Payment Date: ", transactionDate || new Date(),
            "Payment Method: ", 'credit card',
            "Escrow: ", false,
            "Escrow Status: ", 'pending',
            "Escrow Release Conditions: ", ''
        );

        // Create the corresponding payment in the central microservice
        const paymentResponse = await axios.post(`${BASE_URL}/payments`, {
            transaction: transaction._id,
            amount: totalPrice,
            paymentStatus: 'pending',
            paymentDate: transactionDate || new Date(),
            paymentMethod: 'credit card',
            "escrow": false,
            "escrowStatus": "Pending",
            "escrowReleaseConditions": {
                "allPartiesConfirmed": false,
                "transactionVerified": false
            }
        });

        console.log("Payment: ", paymentResponse.data);

        const payment = paymentResponse.data;

        res.status(201).json({ transaction, payment });
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve all transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/transactions`, { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Retrieve a transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/transactions/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Update a transaction by ID
exports.updateTransaction = async (req, res) => {
    try {
        const response = await axios.put(`${BASE_URL}/transactions/${req.params.id}`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
    try {
        const response = await axios.delete(`${BASE_URL}/transactions/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
};

// Confirm a transaction
exports.confirmTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;

        // Fetch the transaction from the central microservice
        const transactionResponse = await axios.get(`${BASE_URL}/transactions/${transactionId}`);
        const transaction = transactionResponse.data?.data;

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the transaction status to 'completed' in the central microservice
        const updatedTransactionResponse = await axios.put(`${BASE_URL}/transactions/${transactionId}`, {
            status: 'completed',
        });

        const updatedTransaction = updatedTransactionResponse.data?.data;

        res.status(200).json({
            message: 'Transaction confirmed',
            transaction: updatedTransaction,
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message,
        });
    }
};
