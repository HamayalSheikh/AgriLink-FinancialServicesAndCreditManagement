const nodemailer = require('nodemailer');
const LoanRepaymentMonitoring = require('../models/LoanRepaymentMonitoring');
const LoanApplication = require('../models/LoanApplication');

const sendRepaymentReminder = async () => {
  try {
    const overdueRepayments = await LoanRepaymentMonitoring.find({
      repaymentDate: { $lt: new Date() },
      status: 'pending'
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    for (const repayment of overdueRepayments) {
      const loan = await LoanApplication.findById(repayment.loanId);
      if (loan) {
        const mailOptions = {
          from: 'your-email@gmail.com',
          to: 'borrower-email@example.com',
          subject: 'Repayment Overdue Reminder',
          text: `Your repayment for Loan ID ${loan.applicationId} is overdue. Please pay immediately.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent for repayment ${repayment.monitoringId}`);
      }
    }
  } catch (error) {
    console.error('Error in sending notifications:', error.message);
  }
};

module.exports = sendRepaymentReminder;
