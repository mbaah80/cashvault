let express  = require('express');
let  router = express.Router();
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config/keys');
let User = require('../model/user');
let nodemailer = require('nodemailer')


const sendEmail = async (email, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: "baahmichael903@gmail.com",
            pass: "Baahmichael903.@"
        }
    });
    await transporter.sendMail({
        from: 'do-not-reply@centralizeBank.com',
        to: email,
        subject: subject,
        text: text
    })
    console.log("Email sent successfully");
}


router.post('/register', (req, res)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    User.findOne({email: req.body.email}, (err, user)=>{
        if(err) {
            res.status(500).json({message: "internal server error", error: err});
        };
        if(user){
            res.status(400).json({message: 'user already exist'});
        }else{
            bcrypt.hash(newUser.password, config.salt, (err, hash)=>{
                if(err) {
                    res.status(500).json({message: "internal server error", error: err});
                };
                newUser.password = hash;
                const token = jwt.sign({user}, config.secret, {expiresIn: 86400});
                newUser.save((err, user)=>{
                    if(err) {
                        res.status(500).json({message: "internal server error", error: err});
                    };
                    if (user){
                        let newUser = {
                            name: user.name,
                            email: user.email,
                        }
                        res.status(201).json({message: 'user created successfully', user: newUser, token:'JWT ' + token});
                        // let subject = 'Welcome to Centralize Bank';
                        // let text = `Hello ${user.name}, Please click on the link below to verify your account. ${config.redirectUrl}/verify/${user.id}/${token}`;
                        // sendEmail(user.email, subject, text)
                        //     .then(()=>{
                        //         res.status(200).json({
                        //             message: 'user created successfully',
                        //             user:user,
                        //             token: token,
                        //         });
                        //     })
                        //     .catch((err)=>{
                        //         res.status(500).json({message: "internal server error send email", error: err});
                        //     })
                    }
                })
            })
        }
    })
})

router.post('/login', (req, res)=>{
  let {email, password} = req.body;
    User.findOne({email: email}, (err, user)=>{
        if(err) {
            res.status(500).json({message: "internal server error", error: err});
        }else if(!user){
            res.status(404).json({message: 'Login credentials are not correct'});
        }else{
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err) {
                    res.status(500).json({message: "internal server error", error: err});
                };
                if(result){
                    const token = jwt.sign({user}, config.secret, {expiresIn: 86400});
                    //don't send user password
                    let newUser = {
                        name: user.name,
                        email: user.email,
                    }
                    res.status(200).json({
                        message: 'user logged in successfully',
                        user:newUser,
                        token:  'JWT ' + token,
                    });
                }else{
                    res.status(401).json({message: 'Login credentials are not correct'});
                }
            })
        }

    })
})

router.post('/verify/:id/:token', (req, res)=>{
       let {id, token} = req.params;
        jwt.verify(token, config.secret, (err, decoded)=>{
            if(err) {
                res.status(500).json({message: "internal server error", error: err});
            };
            if(decoded){
                User.findById(id, (err, user)=>{
                    if(err) {
                        res.status(500).json({message: "internal server error", error: err});
                    };
                    if(user){
                        user.isVerified = true;
                        user.save((err, user)=>{
                            if(err) {
                                res.status(500).json({message: "internal server error", error: err});
                            };
                            if(user){
                                res.status(200).json({message: 'user verified successfully', user: user});
                            }
                        })
                    }
                })
            }
        })
})

router.post('/forgot-password', (req, res)=>{
    let {email} = req.body;
    User.findOne({email: email}, (err, user)=>{
        if(err) {
            res.status(500).json({message: "internal server error", error: err});
        };
        if(user){
            const token = jwt.sign({user}, config.secret, {expiresIn: 86400});
            let subject = 'Reset Password';
            let text = `Hello ${user.name}, Please click on the link below to reset your password. ${config.redirectUrl}/reset-password/${user.id}/${token}`;
            sendEmail(user.email, subject, text)
                .then(()=>{
                    res.status(200).json({
                        message: 'Reset password link sent successfully',
                        user:user,
                        token: token,
                    });
                })
                .catch((err)=>{
                    res.status(500).json({message: "internal server error send email", error: err});
                })
        }else{
            res.status(404).json({message: 'user not found'});
        }
    })
})

router.post('/reset-password/:id/:token', (req, res)=>{
    let {id, token} = req.params;
    let {password} = req.body;
    jwt.verify(token, config.secret, (err, decoded)=>{
        if(err) {
            res.status(500).json({message: "internal server error", error: err});
        };
        if(decoded){
            User.findById(id, (err, user)=>{
                if(err) {
                    res.status(500).json({message: "internal server error", error: err});
                };
                if(user){
                    bcrypt.hash(password, config.salt, (err, hash)=>{
                        if(err) {
                            res.status(500).json({message: "internal server error", error: err});
                        };
                        user.password = hash;
                        user.save((err, user)=>{
                            if(err) {
                                res.status(500).json({message: "internal server error", error: err});
                            };
                            if(user){
                                res.status(200).json({message: 'password reset successfully', user: user});
                            }
                        })
                    })
                }
            })
        }
    })
})


module.exports = router;