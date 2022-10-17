let express = require('express');
let requestLoan = require("../../model/requestloan");
let loanPaymentSchema = require("../../model/loanPayment");
let router = express.Router();


// Admin functions
router.get('/getAllLoan',  (req, res) => {
    requestLoan.find({}, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get request loan' });
        } else {
            res.json({ success: true, requestLoan: requestLoan });
        }
    })
})

router.get('/getAllLoanPayment',  (req, res) => {
    loanPaymentSchema.find({}, (err, loanPaymentSchema) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get loan payment' });
        } else {
            res.json({ success: true, loanPaymentSchema: loanPaymentSchema });
        }
    })
})

router.get('/deleteAllLoan',  (req, res) => {
    requestLoan.deleteMany({}, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete request loan' });
        } else {
            res.json({ success: true, msg: 'Request loan deleted successfully' });
        }
    })
})

router.get('/deleteAllLoanPayment',  (req, res) => {
    loanPaymentSchema.deleteMany({}, (err, loanPaymentSchema) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to delete loan payment' });
        } else {
            res.json({ success: true, msg: 'Loan payment deleted successfully' });
        }
    })
})

router.post('/approveRequestLoan/:id', (req, res) => {
    requestLoan.findOneAndUpdate({ _id: req.params.id }, { $set: { loanStatus: 'Approved' } }, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to approve loan' });
        } else {
            res.json({ success: true, msg: 'Loan approved successfully' });
        }
    })
})

router.post('/rejectRequestLoan/:id', (req, res) => {
    requestLoan.findOneAndUpdate({ _id: req.params.id }, { $set: { loanStatus: 'Rejected' } }, (err, requestLoan) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to reject loan' });
        } else {
            res.json({ success: true, msg: 'Loan rejected ' });
        }
    })
})

module.exports = router;