// express
const express = require('express');
// db
const {mongoose} = require('./db');
// view template
const hbs = require('hbs');
// socket.io
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
// sessions
const session = require("express-session")({
    secret: "vladchatapp-secret",
    resave: true,
    saveUninitialized: true
});
// sharing sessions with socket
const sharedsession = require("express-socket.io-session");
// file system
const fs = require('fs');
// file uploading
const dl = require('delivery');
// logger
const winston = require('winston');
winston.configure({
    transports: [
        new (winston.transports.File)({ filename: 'logs/logfile.log' })
    ]
});
// moment
const moment = require('moment');


// Message model
const {Message} = require('./models/Message');


// APP init
const app = express();
// register hbs-partials
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// register static files
const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));
app.use(session);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('./controllers'));
// start server
const server = http.createServer(app);


// socket init
const io = socketIO(server);

// share sessions
io.use(sharedsession(session, {
    autoSave:true
}));

// all connected users
var connectedUsers = {};

// filepath
const uploadFilePath = __dirname + '/uploads/';

/**
 * IO connection
 */
io.on('connection', (socket) => {
    // get user from session
    const currentUser = socket.handshake.session.loggedUser || {};
    // get user ID
    const currId = currentUser._id;
    // get current user room ID
    const roomId = socket.handshake.session.roomId;

    /**
     * JOIN event. Update all connected users list
     */
    socket.on('join', () => {
        // joining
        socket.join(roomId);
        // add users to the list
        if (!(roomId in connectedUsers)) {
            connectedUsers[roomId] = {};
        }
        connectedUsers[roomId][currId] = currentUser.username;
        // emit event updateUserList
        io.to(roomId).emit('updateUserList', connectedUsers[roomId]);
    });

    /**
     * DISCONNECT event. Update all connected users list
     */
    socket.on('disconnect', function() {
        if ((roomId in connectedUsers) && (currId in connectedUsers[roomId])) {
            delete connectedUsers[roomId][currId];
            // emit event updateUserList
            io.to(roomId).emit('updateUserList', connectedUsers[roomId]);
        }
    });

    /**
     * CREATE NEW MESSAGE event
     */
    socket.on('createMessage', (newMessage) => {
        // get message
        const messageObj = {
            text: newMessage.text,
            user: currentUser._id,
            room: roomId,
            createdAt: newMessage.createdAt,
            fileLink: newMessage.fileLink
        };
        const message = new Message(messageObj);
        // save it
        message.save(function(err) {
            if (err) {
                winston.log('error', err);
                socket.emit('newMessageError', {'text' : "This message couldn't be saved. Please, try one more time :("});
            } else {
                // emit newMessage event
                messageObj.user = currentUser.username;
                io.to(roomId).emit('newMessage', messageObj);
            }
        });
    });

    /**
     * SEND FILE event
     */
    const delivery = dl.listen(socket);
    delivery.on('receive.success',function(file) {
        // file-link
        const fileLink = Date.now() + file.name;
        fs.writeFile(uploadFilePath + fileLink, file.buffer, function(err) {
            if (err) {
                winston.log('error', err);
                socket.emit('newMessageError', {'text' : "This file couldn't be saved. Please, try one more time :("});
            } else {
                const fileMessage = {
                    text: file.name,
                    user: currentUser._id,
                    room: roomId,
                    createdAt: moment().format('MM/DDD/YY, hh:mm a'),
                    fileLink
                };
                const message = new Message(fileMessage);
                // save it
                message.save(function(err) {
                    if (err) {
                        winston.log('error', err);
                        socket.emit('newMessageError', {'text' : "This message couldn't be saved. Please, try one more time :("});
                    } else {
                        // emit newMessage event
                        fileMessage.user = currentUser.username;
                        io.to(roomId).emit('newMessage', fileMessage);
                    }
                });
            }
        });
    });
});

server.listen(3010, () => {
    console.log('Server is up on port 3010...');
});
