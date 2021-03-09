const express = require('express')
const router = express.Router()
const User = require("../models/user");
const crypto = require('crypto');
const moment = require('moment');
const nodemailer = require('nodemailer');

const base64Encode = (data) => {
    let buff = new Buffer.from(data);
    return buff.toString('base64');
}

const base64Decode = (data) => {
    let buff = new Buffer.from(data, 'base64');
    return buff.toString('ascii');
}

const sha256 = (salt, password) => {
    var hash = crypto.createHash('sha512', password);
    hash.update(salt);
    var value = hash.digest('hex');
    return value;
}

router.get('/',(req,res) => {
    res.render("forgotPass");
});

router.post('/',(req,res) => {
    User.findOne({ username: req.body.email.toLowerCase() },(err,usr) => {
        if(err){console.log(err);}
        else{
            if(usr!=null){
                // Generate the necessary data for the link
                const today = base64Encode(new Date().toISOString());
                const ident = base64Encode(usr._id.toString());
                const data = {
                    today: today,
                    userId: usr._id,
                    lastLogin: usr.lastLogin.toISOString(),
                    password: usr.salt,
                    email: usr.username
                };
                const hash = sha256(JSON.stringify(data), process.env.TOKENSECRET);
                // console.log('localhost:5000/forgotPass/password-change/'+ident+'/'+today+'-'+hash);
                // Step 1
                let transporter = nodemailer.createTransport({
                    host: 'smtp.zoho.eu',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.ZID, // TODO: your mail account
                        pass: process.env.ZPASS // TODO: your mail password
                    }
                });

                // Step 2
                let mailOptions = {
                    from: process.env.ZID, // TODO: email sender
                    to: usr.username, // TODO: email receiver
                    subject: 'testing',
                    text: " Reset Password:  http://localhost:5000/forgotPass/password-change/"+ident+"/"+today+"-"+hash
                };
                transporter.sendMail(mailOptions, (err3, datam) => {
                    if (err3) {
                        res.send("FAIL");
                    }else{
                        res.send("Check Mail!");
                    }
                })
            }else{
                res.send("User not found!");
            }
        }
    })
});

router.get('/password-change/:ident/:today-:hash', (req, res) => {
    try {
        // Check if the link in not out of date
        const today = base64Decode(req.params.today); 
        const then = moment(today); 
        const now = moment().utc(); 
        const timeSince = now.diff(then, 'hours');
        if(timeSince > 2) {
            res.send("link is invalid!");
        }

        const userId = base64Decode(req.params.ident);

        User.findOne({_id:userId},(err,account) => {
            // Hash again all the data to compare it with the link
            // THe link in invalid when:
            // 1. If the lastLoginDate is changed, user has already do a login 
            // 2. If the salt is changed, the user has already changed the password
            const data = {
                today: req.params.today,
                userId: account._id,
                lastLogin: account.lastLogin.toISOString(),
                password: account.salt,
                email: account.username
            };
            const hash = sha256(JSON.stringify(data), process.env.TOKENSECRET);

            if(hash !== req.params.hash) {
                res.send("link is invalid!");
            }else{
                res.render('resetPass',{ ident:req.params.ident, hash: req.params.hash, today:req.params.today });
            }
        })

    } catch (error) {
        console.log(error);
    }
})

router.post('/reset/:ident/:today-:hash',(req,res) => {
    try {
        // Check if the link in not out of date
        const today = base64Decode(req.params.today); 
        const then = moment(today); 
        const now = moment().utc(); 
        const timeSince = now.diff(then, 'hours');
        if(timeSince > 2) {
            res.send("link is invalid!");
        }

        const userId = base64Decode(req.params.ident);

        User.findOne({_id:userId},(err,account) => {
            if(err){console.log(err);}else{
                // Hash again all the data to compare it with the link
                // THe link in invalid when:
                // 1. If the lastLoginDate is changed, user has already do a login 
                // 2. If the salt is changed, the user has already changed the password
                const data = {
                    today: req.params.today,
                    userId: account._id,
                    lastLogin: account.lastLogin.toISOString(),
                    password: account.salt,
                    email: account.username
                };
                const hash = sha256(JSON.stringify(data), process.env.TOKENSECRET);
    
                if(hash !== req.params.hash) {
                    res.send("link is invalid!");
                }else{
                    account.setPassword(req.body.pass1, (err, user) => {
                        if(err){console.log(err);}else{
                            account.save()
                            res.send('success!')
                        }
                    })
                }
            }
        })

    } catch (error) {
        console.log(error);
    }
})

module.exports = router