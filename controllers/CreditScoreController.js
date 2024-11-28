const CreditScore = require('../models/CreditScore');
const { updateCreditScore } = require('../utils/creditScoreCalculator');

const getCreditScore = async (req, res) => {
  try {
    const creditScore = await CreditScore.findOne({ userId: req.params.userId });
    if (!creditScore) return res.status(404).json({ message: 'Credit score not found.' });

    res.json(creditScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCreditScoreOnRepayment = async (userId, repaymentStatus, loanAmount) => {
  try {
    let creditScore = await CreditScore.findOne({ userId });

    if (!creditScore) {
      creditScore = new CreditScore({ userId });
    }

    creditScore = updateCreditScore(creditScore, repaymentStatus, loanAmount);
    await creditScore.save();
    return creditScore;
  } catch (error) {
    console.error('Error updating credit score:', error.message);
    throw error;
  }
};

module.exports = { getCreditScore, updateCreditScoreOnRepayment };
