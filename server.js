require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const loanApplicationRoutes = require('./routes/loanApplicationRoutes');
const loanRepaymentMonitoringRoutes = require('./routes/loanRepaymentMonitoringRoutes');
const escrowRoutes = require('./routes/EscrowRoutes');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Route Middleware
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/payments', paymentRoutes);
app.use('/loan-applications', loanApplicationRoutes);
app.use('/loan-repayments', loanRepaymentMonitoringRoutes);
app.use('/es', escrowRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
