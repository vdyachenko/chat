const express = require('express');
const router = express.Router();

const {Room} = require('../models/Room');

/**
 * Main page
 */
router.get('/', (req, res) => {
    // get all created rooms
    Room.find({}).exec((err, rooms) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.render('index', {
                rooms
            });
        }
    });
});

/**
 * Create new room
 */
router.post('/add', (req, res) => {
    // get room name
    const roomName = req.body.roomName || '';
    const newRoom = new Room();
    newRoom.name = roomName;
    newRoom.save().then((newRoom) => {
        const url = '/chat?roomId=' + newRoom._id;
        res.json({url : url, status : 200});
    }, (err) => {
        const errors = [];
        if (err.code === 11000) {
            errors.push('This room name has been already occupied. Please, choose another one.');
        } else if (err.name === 'ValidationError') {
            for (let field in err.errors) {
                errors.push(err.errors[field].message);
            }
        } else {
            errors.push('Unrecognized DB error');
        }
        res.json({err : errors, status : 200});
    });
});

module.exports = router;
