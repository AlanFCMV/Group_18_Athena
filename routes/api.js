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
    Everything in User except Password (check ../models/User),
    error : String
}
*/
router.post('/login', async (req, res, next) => {
    let error = '';

    User.findOne({ $or: [ {Email : req.body.Login}, {Username : req.body.Login} ], Password : req.body.Password }, async (err, user) => {
        console.log(user);
        if (!user) {
            error = 'Login and Password combination incorrect';
            return res.status(400).json({ error : error });
        }
        if (!user.Verified) {
            error = 'User not verified';
            return res.status(400).json({ error : error });
        }
        
        let ret = {
            _id : user._id,
            Verified : user.Verified,
            Score : user.Score,
            Username : user.Username,
            Email : user.Email,
            CreatedCardSets : user.CreatedCardSets,
            LikedCardSets : user.LikedCardSets,
            Following : user.Following,
            Followers : user.Followers,
            CreatedAt : user.CreatedAt,
            error : error
        };
        
        return res.status(200).json({ret});
    });
    
});

// TODO: Hash Password

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

    User.findOne({ Email : req.body.Email }, async (err, user) => {
        if (user) {
            error = 'The email address you have entered is already associated with another account.';
            return res.status(400).json({ error: error });
        }
        User.findOne({ Username : req.body.Username }, async (err, user) => {
            if (user) {
                error = 'The username you have entered is already associated with another account.';
                return res.status(400).json({ error : error });
            }
            User.create(req.body);
            return res.status(200).json({ error : error });
        });
    });

});

module.exports = router;