const express = require('express');
const router = express.Router();

const {User} = require('../models/User');

/**
 * GET registration page
 */
router.get('/', (req, res) => {
    res.render('registration');
});
/**
 * POST registration page
 */
router.post('/', (req, res) => {
    const {username, password} = req.body;
    const newUser = new User();
    newUser.createUser(username, password, (err, createdUser) => {
        if (err) {
            res.json({ err, status: 200 });
        } else {
            req.session.loggedUser = createdUser;
            res.json({ url: '/', status: 200 });
        }
    });

});

module.exports = router;
