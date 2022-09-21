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
                        let subject = 'Welcome to Centralize Bank';
                        let text = `Hello ${user.name}, Please click on the link below to verify your account. ${config.redirectUrl}/verify/${user.id}/${token}`;
                        sendEmail(user.email, subject, text)
                            .then(()=>{
                                res.status(200).json({
                                    message: 'user created successfully',
                                    user:user,
                                    token: token,
                                });
                            })
                            .catch((err)=>{
                                res.status(500).json({message: "internal server error send email", error: err});
                            })
                    }
                })
            })
        }
    })
})


module.exports = router;