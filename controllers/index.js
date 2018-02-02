const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.use('/login', require('./loginController'));
router.use('/registration', require('./registrationController'));
router.use('/chat', auth, require('./chatController'));
router.use('/room', auth, require('./roomController'));

router.get('/', auth, (req, res) => {
    res.redirect('/room');
});

/**
 * Logout
 */
router.get('/logout', auth, (req, res) => {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

/**
 * File download
 */
router.get('/download', auth, function(req, res) {
    const file = 'uploads/' + req.query.file;
    res.download(file);
});

module.exports = router;
