const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Login
router.get('/login', async (req, res, next) => {
    res.send({ test: "works" });
});

// Register
router.post('/register', async (req, res, next) => { 
    /*
    incoming:
      {
        Username: String,
        Password: String,
        Email: String
      }
    outgoing:
      {
        error : String,
      }
    */

    User.create(req.body);

    var ret = {error:''};
    res.status(200).json(ret);
});

module.exports = router;