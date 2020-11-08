const express = require('express');
const validator = require('validator');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Import Schemas
const User = require('../models/user');
const Token = require('../models/token');
const CardSet = require('../models/cardset');

require('dotenv').config();
const gmail = process.env.GMAIL;
const gpass = process.env.GMAIL_PASSWORD;


/* Login
incoming:
{
    Login: String, (Username or the Email)
    Password: String
}
outgoing:
{
    Everything in User except Password (check ../models/User),
    error : String
}
*/
router.post('/login', async (req, res, next) => {
    let error = '';

    User.findOne({ $or: [{ Email: req.body.Login }, { Username: req.body.Login }] }, async (err, user) => {

        // Ensures there was a user instance given the Email or Username?
        if (!user) {
            error = 'Login and Password combination incorrect';
            return res.status(400).json({ error: error });
        }
        // Ensures the found user has the correct password.
        let passwordMatch = await user.comparePassword(req.body.Password, this.Password);
        if (!passwordMatch) {
            error = 'Login and Password combination incorrect';
            return res.status(400).json({ error: error });
        }
        // Ensures the user is verified.
        if (!user.Verified) {
            error = 'User not verified';
            return res.status(400).json({ error: error });
        }

        // Returns the selected values for use.
        let ret = {
            _id: user._id,
            Score: user.Score,
            Username: user.Username,
            Email: user.Email,
            CreatedCardSets: user.CreatedCardSets,
            LikedCardSets: user.LikedCardSets,
            Following: user.Following,
            Followers: user.Followers,
            CreatedAt: user.CreatedAt,
            error: error
        };

        return res.status(200).json({ ret });
    });

});

/* Register
incoming:
{
    Username: String,
    Password: String,
    Email: String
}
outgoing:
{   
    error : String
}
*/
router.post('/register', async (req, res, next) => {
    let error = '';

    // Make sure the email is an email.
    if (!validator.isEmail(req.body.Email)) {
        error = 'Invalid Email Address';
        return res.status(400).json({ error: error });
    }
    else if (validator.isEmail(req.body.Username)) {
        error = 'Invalid Username';
        return res.status(400).json({ error: error });
    }

    User.findOne({ Email: req.body.Email }, async (err, user) => {
        if (user) {
            error = 'The email address you have entered is already associated with another account.';
            return res.status(400).json({ error: error });
        }
        User.findOne({ Username: req.body.Username }, async (err, user) => {
            if (user) {
                error = 'The username you have entered is already associated with another account.';
                return res.status(400).json({ error: error });
            }

            // Create and save the user
            user = new User({ Username: req.body.Username, Email: req.body.Email, Password: req.body.Password });
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }

                // Create a verification token for this user
                let token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

                // Save the verification token
                token.save(function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }

                    let nodemailer = require('nodemailer');
                    console.log(gmail, gpass, req.body.Email);
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: gmail,
                            pass: gpass
                        }
                    });

                    let mailOptions = {
                        from: 'Athena <no-reply@athena18.herokuapp.com>',
                        to: req.body.Email,
                        subject: 'Account Verification',
                        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
            });

            return res.status(200).json({ error: error });
        });
    });

});

// Email Confirmation
/*
    Incoming:
    {
        TokenId : You know what this is
    }
*/
router.post('/confirmation', async (req, res, next) => {
    // Find a matching token
    Token.findOne({ token: req.body.TokenId }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: req.body.Email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.Verified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.Verified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
});

// Email Resend
/*
    Incoming
    {
        Email : String
    }
*/
router.post('/resend', async (req, res, next) => {
    User.findOne({ Email: req.body.Email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.Verified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        let token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }

            // Send the email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmail,
                    pass: gpass
                }
            });

            let mailOptions = {
                from: 'Athena <no-reply@athena18.herokuapp.com>',
                to: user.Email, subject: 'Account Verification',
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n'
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });
    });
});


// Creates a token + sends out email for password reset
/*
    Incoming
    {
        Email : String
    }
*/
router.post('/reset', async (req, res, next) => {
    User.findOne({ Email: req.body.Email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        // if (user.Verified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        let token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }

            // Send the email
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmail,
                    pass: gpass
                }
            });

            let mailOptions = {
                from: 'Athena <no-reply@athena18.herokuapp.com>',
                to: user.Email, subject: 'Password Reset',
                text: 'Hello,\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/reset\/' + token.token + '.\n'
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
                res.status(200).send('A link to reset your password has been sent to ' + user.email + '.');
            });
        });
    });
});

// Resets the password.
/*
    Incoming:
    {
        TokenId: You know what this is
        Password: String
    }
*/
router.post('/updatepassword', async (req, res, next) => {
    // Find a matching token
    Token.findOne({ token: req.body.TokenId }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId}, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });

            // Update the password.
            user.Password = req.body.Password;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account password has been reset. Please log in.");
            });
        });
    });
});

// Adds to set of cards
/*
    Incoming:
    {
        Creator: ObjectId,
        Name: String,
        Public: Boolean,
        Cards: [{
            Question: String,
            Answer: String
        }]
    }
*/
router.post('/addset', async (req, res, next) => {
    let error = '';

    User.findById(req.body.Creator, async (err, user) => {
        if (!user) {
            error = 'User not found';
            return res.status(400).json({ error: error });
        }

        let newSet = await CardSet.create(req.body);
        user.CreatedCardSets.push(newSet._id);
        await user.save();

        return res.status(200).json({ error: error });
    });
});

// Edits the set of cards
/*
    Incoming:
    {
        _id: ObjectId,
        Name: String,
        Public: Boolean,
        Cards: [{
            _id: ObjectId,
            Question: String,
            Answer: String
        }]
    }
*/
router.post('/editset', async (req, res, next) => {
    let error = '';

    CardSet.findOneAndUpdate({ _id: req.body._id }, { Name: req.body.Name, Public: req.body.Public, Cards: req.body.Cards }, { useFindAndModify: false }, async (err, cardset) => {
        if (!cardset) {
            error = 'Cardset not found';
            return res.status(400).json({ error: error });
        }
        return res.status(200).json({ error: error });
    });
});

// Delete cardset
/*
    Incoming:
    {
        _id: ObjectId,
    }
*/
router.post('/deleteset', async (req, res, next) => {
    let error = '';

    CardSet.findOneAndRemove({ _id: req.body._id }, { useFindAndModify: false }, async (err, cardset) => {
        if (!cardset) {
            error = 'Cardset not found';
            return res.status(400).json({ error: error });
        }

        User.findById(cardset.Creator, async (err, user) => {
            if (!user) {
                error = 'User not found';
                return res.status(400).json({ error: error });
            }

            user.CreatedCardSets.splice(user.CreatedCardSets.indexOf(req.body._id), 1);
            user.Score -= cardset.LikedBy.length;
            await user.save();

            return res.status(200).json({ error: error });
        });
    });
});

// Like cardset
/*
    Incoming:
    {
        UserId: ObjectId,   --This is the user liking the cardset
        SetId: ObjectId    --This is the cardset the user liked
    }
    Process of updating like: user, cardset, other user
*/
router.post('/like', async (req, res, next) => {
    let error = '';

    User.findById(req.body.UserId, async (err, user) => {
        if (!user) {
            error = 'User not found';
            return res.status(400).json({ error: error });
        }
        CardSet.findById(req.body.SetId, async (err, cardset) => {
            if (!cardset) {
                error = 'CardSet not found';
                return res.status(400).json({ error: error });
            }
            User.findById(cardset.Creator, async (err, creator) => {
                user.LikedCardSets.push(req.body.SetId);
                await user.save();
                cardset.LikedBy.push(req.body.UserId);
                await cardset.save()
                creator.Score++;
                await creator.save();

                return res.status(200).json({ error: error });
            });
        });
    });
});

// Unlike cardset
/*
    Incoming:
    {
        UserId: ObjectId,   --This is the user unliking the cardset
        SetId: ObjectId    --This is the cardset the user unliked
    }
    Process of updating unlike: user, cardset, other user
*/
router.post('/unlike', async (req, res, next) => {
    let error = '';

    User.findById(req.body.UserId, async (err, user) => {
        if (!user) {
            error = 'User not found';
            return res.status(400).json({ error: error });
        }
        CardSet.findById(req.body.SetId, async (err, cardset) => {
            if (!cardset) {
                error = 'CardSet not found';
                return res.status(400).json({ error: error });
            }
            User.findById(cardset.Creator, async (err, creator) => {
                user.LikedCardSets.splice(user.LikedCardSets.indexOf(req.body.SetId), 1);
                await user.save();
                cardset.LikedBy.splice(cardset.LikedBy.indexOf(req.body.UserId), 1);
                await cardset.save()
                creator.Score--;
                await creator.save();

                return res.status(200).json({ error: error });
            });
        });
    });
});

// Follow person
/*
    Incoming:
    {
        UserId: ObjectId,   --This is the user being followed
        FollowerId: ObjectId    --This is the user
    }
    Process of updating follow: user, follower
*/
router.post('/follow', async (req, res, next) => {
    let error = '';

    User.findById(req.body.UserId, async (err, user) => {
        if (!user) {
            error = 'Followed User not found';
            return res.status(400).json({ error: error });
        }
        User.findById(req.body.FollowerId, async (err, follower) => {
            if (!follower) {
                error = 'Follower User not found';
                return res.status(400).json({ error: error });
            }
            user.Followers.push(req.body.FollowerId);
            await user.save();
            follower.Following.push(req.body.UserId);
            await follower.save()

            return res.status(200).json({ error: error });
        });
    });
});

// Unfollow person
/*
    Incoming:
    {
        UserId: ObjectId,   --This is the user being unfollowed
        FollowerId: ObjectId    --This is the user unfollowing
    }
    Process of updating unfollow: user, unfollower
*/
router.post('/unfollow', async (req, res, next) => {
    let error = '';

    User.findById(req.body.UserId, async (err, user) => {
        if (!user) {
            error = 'Followed User not found';
            return res.status(400).json({ error: error });
        }
        User.findById(req.body.FollowerId, async (err, follower) => {
            if (!follower) {
                error = 'Follower User not found';
                return res.status(400).json({ error: error });
            }
            user.Followers.splice(user.Followers.indexOf(req.body.FollowerId), 1);
            await user.save();
            follower.Following.splice(follower.Following.indexOf(req.body.UserId), 1);
            await follower.save()

            return res.status(200).json({ error: error });
        });
    });
});

// Search cardset

module.exports = router;