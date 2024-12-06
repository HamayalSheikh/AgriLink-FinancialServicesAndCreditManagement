require('dotenv').config();
require('./schedulers'); // Automatically starts the scheduled tasks
const express = require('express');
const cors = require('cors'); // Add this line
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const loanApplicationRoutes = require('./routes/loanApplicationRoutes');
const loanRepaymentMonitoringRoutes = require('./routes/loanRepaymentMonitoringRoutes');
const escrowRoutes = require('./routes/EscrowRoutes');
const testRoutes = require('./routes/testRoutes');
const creditScoreRoutes = require('./routes/creditScoreRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// connectDB();

// Route Middleware
app.use('/transactions', transactionRoutes);
app.use('/payments', paymentRoutes);
app.use('/loan-applications', loanApplicationRoutes);
app.use('/loan-repayments', loanRepaymentMonitoringRoutes);
app.use('/es', escrowRoutes);
app.use('/creditscore', creditScoreRoutes);
app.use('/test', testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
