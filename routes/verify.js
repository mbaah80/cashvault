let express = require('express');
const passport = require("passport");
let config = require('../config/urls');
let axios = require('axios');
let router = express.Router();


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