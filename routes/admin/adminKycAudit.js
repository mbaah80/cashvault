let express = require('express');
let router = express.Router();
let individualKyc = require('../../model/individualKyc');
let businessKyc = require('../../model/businessKyc');


router.get('/getAllIndividualKyc', (req, res) => {
    individualKyc.find({}, (err, individualKyc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get individual kyc' });
        } else {
            res.json({ success: true, individualKyc: individualKyc });
        }
    })
})

router.get('/getAllBusinessKyc', (req, res) => {
    businessKyc.find({}, (err, businessKyc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to get business kyc' });
        } else {
            res.json({ success: true, businessKyc: businessKyc });
        }
    })
})

router.post('/approveIndividualKycAudit/:id', (req, res) => {
       individualKyc.findOneAndUpdate({ _id: req.params.id }, { $set: { auditStatus: 'Approved' } }, (err, individualKyc) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to approve kyc' });
            } else {
                res.json({ success: true, msg: 'Kyc approved successfully' });
            }
        })
})

router.post('/rejectIndividualKycAudit/:id', (req, res) => {
    individualKyc.findOneAndUpdate({ _id: req.params.id }, { $set: { auditStatus: 'Rejected' } }, (err, individualKyc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to reject kyc' });
        } else {
            res.json({ success: true, msg: 'Kyc rejected successfully' });
        }
    })
})

router.post('/approveBusinessKycAudit/:id', (req, res) => {
    businessKyc.findOneAndUpdate({ _id: req.params.id }, { $set: { auditStatus: 'Approved' } }, (err, businessKyc) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to approve kyc' });
        } else {
            res.json({ success: true, msg: 'Kyc approved successfully' });
        }
    })
})

router.post('/rejectBusinessKycAudit/:id', (req, res) => {
   businessKyc.findOneAndUpdate({ _id: req.params.id }, { $set: { auditStatus: 'Rejected' } }, (err, businessKyc) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to reject kyc' });
            } else {
                res.json({ success: true, msg: 'Kyc rejected successfully' });
            }
        })
})


module.exports = router;