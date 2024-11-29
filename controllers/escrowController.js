const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

// Create an escrow transaction
exports.createEscrow = async (req, res) => {
  try {
    // const { fromUserId, toUserId, amount, paymentType } = req.body;
    const { fromUserId, toUserId, amount } = req.body;
    

    const payment = new Payment({
      fromUserId,
      toUserId,
      amount,
    //   paymentType,
    paymentStatus: 'pending',  // Default status as 'pending'
      paymentDate: new Date(),   // Set the current date and time
      transactionId: uuidv4(),
      escrow: true,
      escrowStatus: 'Pending',
      escrowReleaseConditions: {
        allPartiesConfirmed: false,
        transactionVerified: false
      }
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating escrow transaction:', error);  // Log the error
    res.status(500).json({ error: 'Error creating escrow transaction' });
  }
};

// Verify escrow conditions
exports.verifyEscrowConditions = async (req, res) => {
  try {
    const { transactionId, conditionType } = req.body;
    const payment = await Payment.findOne({ transactionId });

    if (!payment || payment.escrowStatus !== 'Pending') {
      return res.status(404).json({ error: 'Transaction not found or not in escrow' });
    }

    if (conditionType === 'allPartiesConfirmed') {
      payment.escrowReleaseConditions.allPartiesConfirmed = true;
    } else if (conditionType === 'transactionVerified') {
      payment.escrowReleaseConditions.transactionVerified = true;
    }

    await payment.save();
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error verifying escrow conditions' });
  }
};

// Release escrow funds
exports.releaseEscrowFunds = async (req, res) => {
    try {
      const { transactionId } = req.params;
      const payment = await Payment.findOne({ transactionId });
  
      if (!payment) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
  
      if (payment.escrowStatus === 'Released') {
        return res.status(400).json({ error: 'Funds already released' });
      }
  
      if (
        payment.escrowReleaseConditions.allPartiesConfirmed &&
        payment.escrowReleaseConditions.transactionVerified
      ) {
        payment.escrow = false; // Funds no longer in escrow
        payment.escrowStatus = 'Released';
  
        await payment.save();
        res.status(200).json({ message: 'Funds released successfully', payment });
      } else {
        res.status(400).json({ error: 'Escrow conditions not met' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error releasing funds' });
    }
  };

  // Route to fetch escrow details
exports.getEscrowDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;  // Get transaction ID from params
    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Return escrow details
    const escrowDetails = {
      transactionId: payment.transactionId,
      amount: payment.amount,
      escrowStatus: payment.escrowStatus,
      escrowReleaseConditions: payment.escrowReleaseConditions
    };

    res.status(200).json(escrowDetails);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching escrow details' });
  }
};
