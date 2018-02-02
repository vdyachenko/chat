const express = require('express');
const router = express.Router();

const {User} = require('../models/User');

/**
 * GET login page
 */
router.get('/', (req, res) => {
    res.render('login');
});

/**
 * POST login page
 */
router.post('/', (req, res) => {
    // get POST-data
    const {username, password} = req.body;
    // check username and password validity
    User.checkLogin(username, password, (err, currentUser) => {
        if (err) {
            res.json({ err, status: 200 });
        } else {
            req.session.loggedUser = currentUser;
            res.json({ url: '/', status: 200 });
        }
    });
});

module.exports = router;
