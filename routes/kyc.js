let express = require('express');
let router = express.Router();
let passport = require('passport');
let individualKyc = require('../model/individualKyc');
let businessKyc = require('../model/businessKyc');
let multer  = require('multer');
const config = require("../config/urls");
const axios = require("axios");
let upload = multer({ dest: 'uploads/' });
let idCard  = multer({ dest: 'uploads/IdFolder/' });


//individual kyc
router.post('/individualKyc', passport.authenticate('jwt', {session:'false'}), idCard.array('ID', 2), (req, res) => {
  try {
      let {firstName, lastName, middleName, contact, idType, idNumber, idExpiry, idIssueDate, address, dob, ssNumber, employementStatus, employerName, identityImage} = req.body;
      let newIndividualKyc = new individualKyc({
          userId: req.body.userId,
          firstName: firstName,
          lastName: lastName,
          middleName: middleName,
          contact: contact,
          ssNumber: ssNumber,
          employementStatus: employementStatus,
          employerName: employerName,
          idType: idType,
          idNumber: idNumber,
          idExpiry: idExpiry,
          idIssueDate: idIssueDate,
          address: address,
          dob: dob,
          identityImage: identityImage,
      })
      newIndividualKyc.save((err, individualKyc) => {
          if(err){
              res.json({ success: false, msg: 'Failed to save kyc' });
          } else {
              res.status(201).json({ success: true, msg: 'Kyc saved successfully' });
          }
      })
  }catch (error) {
      console.log(error);
  }
})

router.get('/getIndividualKyc', passport.authenticate('jwt', {session:'false'}), (req, res) => {
    individualKyc.find({userId: req.user._id}, (err, individualKyc) => {
        if(err){
            res.json({ success: false, msg: 'Failed to get kyc' });
        } else {
            res.status(201).json({ success: true, msg: 'Kyc fetched successfully', individualKyc: individualKyc });
        }
    })
})

router.post('/updateIndividualKyc/:id', passport.authenticate('jwt', {session:'false'}), idCard.array('ID', 2), (req, res) => {
    try {
        let {firstName, lastName, middleName, contact, idType, idNumber, idExpiry, idIssueDate, address, dob, ssNumber, employementStatus, employerName, identityImage} = req.body;
        individualKyc.findByIdAndUpdate(req.params.id, {
            firstName: firstName,
            lastName: lastName,
            middleName: middleName,
            contact: contact,
            ssNumber: ssNumber,
            employementStatus: employementStatus,
            employerName: employerName,
            idType: idType,
            idNumber: idNumber,
            idExpiry: idExpiry,
            idIssueDate: idIssueDate,
            address: address,
            dob: dob,
            identityImage: identityImage,
        }, (err, individualKyc) => {
            if(err){
                res.json({ success: false, msg: 'Failed to update kyc' });
            } else {
                res.status(201).json({ success: true, msg: 'Kyc updated successfully' });
            }
        })
    }catch (error) {
        console.log(error);
    }
})



//business kyc
router.post('/businessKyc', passport.authenticate('jwt', {session:'false'}), upload.array('businessCertificate', 2), (req, res) => {
    let {businessName, businessAddress, businessContact, businessEmail,businessType,businessTin,businessRegNumber, businessRegDate,businessOwner, businessOwnerAddress,businessOwnerContact,businessOwnerEmail,  businessCertificate} = req.body;
    let newBusinessKyc = new businessKyc({
        userId: req.body.userId,
        businessName: businessName,
        businessAddress: businessAddress,
        businessContact: businessContact,
        businessEmail: businessEmail,
        businessType: businessType,
        businessTin: businessTin,
        businessRegNumber: businessRegNumber,
        businessRegDate: businessRegDate,
        businessCertificate: businessCertificate,
        businessOwner: businessOwner,
        businessOwnerAddress: businessOwnerAddress,
        businessOwnerContact: businessOwnerContact,
        businessOwnerEmail: businessOwnerEmail,
    })
    newBusinessKyc.save((err, businessKyc) => {
        if(err){
            res.json({ success: false, msg: 'Failed to save kyc' });
        } else {
            res.status(201).json({ success: true, msg: 'Kyc saved successfully' });
        }
    })
})


router.get('/businessKyc', passport.authenticate('jwt', {session:'false'}), (req, res) => {
    businessKyc.find({userId: req.user._id}, (err, businessKyc) => {
        if(err){
            res.json({ success: false, msg: 'Failed to get kyc' });
        } else {
            res.status(201).json({ success: true, msg: 'Kyc fetched successfully', businessKyc: businessKyc });
        }
    })
})

//verify tin
router.post('/tin', passport.authenticate('jwt', { session: false }), (req, res) => {
    let tinUrl= 'gh/tin'
    let {tin} = req.body;
    let headers = {
        'Authorization': 'Bearer ' + config.apruveToken,
    }
    let payload = {
        tin: tin
    }
    axios.post(config.apruveBaseUrl + tinUrl, payload, { headers: headers })
        .then(response => {
            res.json(response.data);
        })
        .catch((error) => {
            res.json(error.response.data);
        })
})

//verify drivers license
router.post('/driverslicense', passport.authenticate('jwt', { session: false }), (req, res) => {
    let driverLicenseUrl= 'gh/driver_license'
    let {id, full_name, date_of_birth} = req.body;
    let headers = {
        'Authorization': 'Bearer ' + config.apruveToken,
    }
    let payload = {
        id: id,
        full_name: full_name,
        date_of_birth: date_of_birth
    }
    axios.post(config.apruveBaseUrl + driverLicenseUrl, payload, { headers: headers })
        .then(response => {
            res.json(response.data);
        })
        .catch((error) => {
            res.json(error.response.data);
        })
})


//verify ssnit
router.post('/ssnit', passport.authenticate('jwt', { session: false }), (req, res) => {
    let ssnitUrl= 'gh/ssnit'
    let {id, full_name, date_of_birth} = req.body;
    let headers = {
        'Authorization': 'Bearer ' + config.apruveToken,
    }
    let payload = {
        id: id,
        full_name: full_name,
        date_of_birth: date_of_birth
    }
    axios.post(config.apruveBaseUrl + ssnitUrl, payload, { headers: headers })
        .then(response => {
            res.json(response.data);
        })
        .catch((error) => {
            res.json(error.response.data);
        })
})


//verify passport
router.post('/passport', (req, res) => {
    let passportUrl= 'gh/passport'
    let {id, first_name, last_name,middle_name, date_of_birth} = req.body;
    let header = {
        'Authorization': 'Bearer ' + config.apruveToken,
    }
    let payload = {
        id: id,
        first_name: first_name,
        last_name: last_name,
        middle_name: middle_name,
        date_of_birth: date_of_birth
    }
    axios.post(config.apruveBaseUrl + passportUrl, payload, { headers: header })
        .then(response => {
            res.json(response.data);
        })
        .catch((error) => {
            res.json(error.response.data);
        })
})



module.exports = router;