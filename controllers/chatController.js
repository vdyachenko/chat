const express = require('express');
const router = express.Router();

const {Message} = require('../models/Message');
const {Room} = require('../models/Room');

router.get('/', (req, res) => {
    const roomId = req.query.roomId || null;
    const currentUser = req.session.loggedUser;
    Room.findOne({ '_id': roomId}, (err, room) => {
        if (err || !room) {
            return res.redirect('/room');
        }
        req.session.roomId = roomId;
        Message.
        find({
            room: roomId
        }).
        populate('user', 'username').
        exec(function (err, messages) {
            res.render('chat', {
                currentUser,
                messages
            });
        });
    });
});

module.exports = router;