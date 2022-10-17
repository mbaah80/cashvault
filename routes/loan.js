let express = require('express');
let router = express.Router();
let passport = require('passport');
let schedule = require('node-schedule');
let requestLoan = require('../model/requestloan');
let loanPaymentSchema = require('../model/loanPayment');

router.post('/requestLoan', passport.authenticate('jwt', {session:'false'}),(req, res) => {
    try {
        //calculate interest rate 5% of loan amount
        let interest = 0.05;
        let term;
        if(req.body.loanType === 'personal'){
            term = 6;
        } else if(req.body.loanType === 'business'){
            term = 12;
        } else if(req.body.loanType === 'mortgage'){
            term = 24;
        } else if(req.body.loanType === 'car'){
            term = 36;
        } else if(req.body.loanType === 'student'){
            term = 48;
        } else {
            term = 60;
        }
        //check if loan term is passed

        let monthlyPayment = req.body.loanAmount * interest / (1 - (Math.pow(1/(1 + interest), term)));
        monthlyPayment = monthlyPayment.toFixed(2);
        let totalInterest = (monthlyPayment * term) - req.body.loanAmount;
        totalInterest = totalInterest.toFixed(2);
        let loanRepayment = monthlyPayment * term;
        loanRepayment = loanRepayment.toFixed(2);

        let newRequestLoan = new requestLoan({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            loanAmount: req.body.loanAmount,
            repaymentAmount: loanRepayment,
            loanPurpose: req.body.loanPurpose,
            loanType: req.body.loanType,
            loanTerm: term,
            // loanRate: loanRate,
            loanMonthlyPayment: monthlyPayment,
            loanInterest: totalInterest,
            userId: req.body.userId,
        });
        requestLoan.findOne({ userId: req.body.userId }, (err, requestLoan) => {
            if (err) {
                res.status(404).json({ success: false, msg: 'Failed to request loan' });
            } else {
                if (requestLoan) {
                    res.status(201).json({ success: false, msg: 'You have already requested a loan' });
                } else {
                    newRequestLoan.save((err, requestLoan) => {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to request loan' });
                        } else {
                            res.status(200).json({ success: true, msg: 'Loan requested, waiting for approval' });
                        }
                    });
                }
            }
        })
    }catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
})

router.post('/repayLoan', passport.authenticate('jwt', {session:'false'}), (req, res) => {
   try {
       let {amount, channel, accNumber, transactionId, network } = req.body;
       requestLoan.findOne({ userId: req.body.userId }, (err, requestLoan) => {
           if(err){
               res.status(404).json({ success: false, msg: 'Failed to repay loan' });
           }
           if(requestLoan){
               if(requestLoan.loanStatus === 'Late Payment'){
                   res.status(201).json({ success: false, msg: 'You have a late payment, please pay your loan' });
               } else {
                   if(requestLoan.repaymentAmount < amount){
                       let loanPayment = new loanPaymentSchema({
                           amount: amount,
                           channel: channel,
                           accNumber: accNumber,
                           transactionId: transactionId,
                           network: network,
                           userId: req.body.userId,
                       })
                       loanPayment.save((err, loanPayment) => {
                           if(err){
                               res.json({ success: false, msg: 'Failed to repay loan' });
                           } else {
                               res.status(201).json({ success: false, msg: 'You are paying more than the loan amount' });
                           }
                       })
                   }
                   else if(requestLoan.repaymentAmount > amount){
                       requestLoan.repaymentAmount = requestLoan.repaymentAmount - amount;
                       requestLoan.save(err, requestLoan => {
                           if(err){
                               res.status(404).json({ success: false, msg: 'Failed to repay loan' });
                           } else {
                               let loanPayment = new loanPaymentSchema({
                                   amount: amount,
                                   channel: channel,
                                   accNumber: accNumber,
                                   transactionId: transactionId,
                                   network: network,
                                   userId: req.body.userId,
                               })
                               loanPayment.save((err, loanPayment) => {
                                   if(err){
                                       res.json({ success: false, msg: 'Failed to repay loan' });
                                   } else {
                                       res.status(200).json({ success: true, msg: 'Only part payment was made on your loan' });
                                   }
                               })
                           }
                       });

                   }
                   else {
                       requestLoan.repaymentAmount = requestLoan.repaymentAmount - amount;
                       requestLoan.loanStatus = 'Loan Repaid';
                       requestLoan.loanPurpose = 'Loan Repaid';
                       requestLoan.loanAmount = 0;
                       requestLoan.loanTerm = 0;
                       requestLoan.loanMonthlyPayment = 0;
                       requestLoan.loanInterest = 0;
                       requestLoan.save( err, requestLoan => {
                           if(err){
                               res.status(404).json({ success: false, msg: 'Failed to repay loan' });
                           } else {
                               let loanPayment = new loanPaymentSchema({
                                   amount: amount,
                                   channel: channel,
                                   accNumber: accNumber,
                                   transactionId: transactionId,
                                   network: network,
                                   userId: req.body.userId,
                               })
                               loanPayment.save((err, loanPayment) => {
                                   if(err){
                                       res.json({ success: false, msg: 'Failed to repay loan' });
                                   } else {
                                       res.status(200).json({ success: true, msg: 'Loan repaid successfully' });
                                       deletePaidLoan();
                                   }
                               })
                           }
                       });

                   }
               }
           }
       })
   }catch (err) {
       res.status(500).json({ success: false, msg: 'Server error' });
   }
})

router.get('/getUserLoan', passport.authenticate('jwt', { session: 'false' }), (req, res) => {
    requestLoan.find({userId: req.body.userId}, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get request loan' });
        } else {
            res.json({ success: true, requestLoan: requestLoan });
        }
    })
})

router.get('/getLoanPayment', passport.authenticate('jwt', { session: 'false' }), (req, res) => {
    loanPaymentSchema.find({userId: req.body.userId}, (err, loanPaymentSchema) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get loan payment' });
        } else {
            res.json({ success: true, loanPaymentSchema: loanPaymentSchema });
        }
    })
})

router.get('/loan/:id', passport.authenticate('jwt', { session: 'false' }), (req, res) => {
    requestLoan.findById(req.params.id, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get request loan' });
        } else {
            res.json({ success: true, requestLoan: requestLoan });
        }
    })
})

router.get('/loanPayment/:id', passport.authenticate('jwt', { session: 'false' }), (req, res) => {
    loanPaymentSchema.findById(req.params.id, (err, loanPaymentSchema) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get loan payment' });
        } else {
            res.json({ success: true, loanPaymentSchema: loanPaymentSchema });
        }
    })
})

router.get('/deleteLoan/:id', passport.authenticate('jwt', { session: 'false' }), (req, res) => {
    requestLoan.findByIdAndDelete(req.params.id, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete request loan' });
        } else {
            res.json({ success: true, msg: 'Request loan deleted successfully' });
        }
    })
})

router.get('/deleteLoanPayment/:id', passport.authenticate('jwt', { session: 'false' }), (req, res) => {
    loanPaymentSchema.findByIdAndDelete(req.params.id, (err, loanPaymentSchema) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete loan payment' });
        } else {
            res.json({ success: true, msg: 'Loan payment deleted successfully' });
        }
    })
})



passedLoanTerm = (req, res, next) => {
    try {
        requestLoan.find({}, (err, requestLoan) => {
            if (err) {
            } else {
                let month = new Date().getMonth();
                requestLoan.forEach(loan => {
                    if (loan.loanTerm < month) {
                        let lateInterestRate = 0.125.toFixed(2);
                        loan.loanMonthlyPayment = loan.loanMonthlyPayment * lateInterestRate * (loan.loanTerm - month);
                        loan.loanMonthlyPayment = loan.loanMonthlyPayment.toFixed(2);
                        loan.repaymentAmount = loan.repaymentAmount + loan.loanMonthlyPayment;
                        loan.loanStatus = 'Late Payment';
                        loan.save();
                }else {
                        requestLoan.loanStatus = 'Your loan is still active';
                    }
            })
            }
        })
    }catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
}
deletePaidLoan = (req, res, next) => {
 try {
     requestLoan.find({}, (err, requestLoan) => {
         if (err) {
             res.json({ success: false, msg: 'Failed to delete loan' });
         } else {
             requestLoan.forEach(loan => {
                 if (loan.loanStatus === 'Loan Repaid') {
                     loan.remove();
                 }
             })
         }
     })
 }  catch (err) {
     res.status(500).json({ success: false, msg: 'Server error' });
 }
}
userCreditScore = (req, res, next) => {
    console.log('userCreditScore');
}

schedule.scheduleJob('0 0 1 * *', function(){
    passedLoanTerm();
});


module.exports = router;