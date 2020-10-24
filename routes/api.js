const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* Login
incoming:
{
    Login: String, (Username or the Email)
    Password: String
}
outgoing:
{
    
    error : String
}
*/
router.get('/login', async (req, res, next) => {

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

    User.findOne({ Email: req.body.Email }, async (err, user) => {
        if (user) {
            console.log("Got here");
            error = 'The email address you have entered is already associated with another account.';
            return res.status(400).json({ error: error });
        }
        User.findOne({ Username: req.body.Username }, async (err, user) => {
            if (user) {
                console.log("Got here");
                error = 'The username you have entered is already associated with another account.';
                return res.status(400).json({ error: error });
            }
            User.create(req.body);
            return res.status(200).json({ error: error });
        });
    });

});

module.exports = router;