// socket.io
const socket = io();

$(document).ready(function() {

    // emit join event
    socket.emit('join');

    /**
     * Send message handler
     */
    $('#userMessage').on('keyup', function(e) {
        if (e.which === 13) {
            // get all data
            var now = moment().format('MM/DDD/YY, hh:mm a');
            var dataMessage = {
                text: $('#userMessage').val(),
                user: $('#userUsername').val(),
                createdAt: now,
                fileLink: ''
            };
            // emit createMessage event
            socket.emit('createMessage', dataMessage);
            $('#userMessage').val('');
        }
    });

    /**
     * Click on 'Upload' button
     */
    $('#uploadFile').on('click', function(e) {
        e.preventDefault();
        $('#fileUpload').click();
    });

    /**
     * Upload file event
     */
    $('#fileUpload').on('change', function() {
        // send file
        var delivery = new Delivery(socket);
        var file = $(this)[0].files[0];
        delivery.send(file, {});
    });
});

/**
 * NEW MESSAGE event
 */
socket.on('newMessage', function(newMessage) {
    var type = newMessage.fileLink === '' ? 1 : 2;
    appendMessage(newMessage, type);
});

/**
 * UPDATE USER LIST event
 */
socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>');
    $.each(users, function(index, value) {
        ol.append(jQuery('<li></li>').text(value));
    });
    $('#users').html(ol);

});

/**
 * ERROR event
 */
socket.on('newMessageError', function(error) {
    appendMessage(error, 3);
});

/**
 * Append message in the chat
 * @param newMessage
 * @param type
 */
function appendMessage(newMessage, type) {
    var template = '';
    if (type === 1) {
        template = '<li><p><b>' + newMessage.user + ':</b> <span style="font-size: 12px;color:grey;">' + newMessage.createdAt + '</span><br/> ' + newMessage.text + '</p></li>';
    } else if (type === 2) {
        template = '<li><p><b>' + newMessage.user + ':</b> <span style="font-size: 12px;color:grey;">' + newMessage.createdAt + '</span><br/> '
            + '<a href="download?file=' + newMessage.fileLink + '" target="_blank">' + newMessage.text + '</a></p></li>';
    } else if (type === 3) {
        template = '<li style="color:red;"><p><b>Admin:</b><br/><span> ' + newMessage.text + '</span></p></li>';
    }
    $("#chatBlock").append(template);
}