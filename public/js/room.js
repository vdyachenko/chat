$(document).ready(function() {
    $('#createNewRoom').on('click', function() {
        // message block
        var target = $('#messageBlock');
        // clear old messages
        showMessage(target, '');
        var data = {
            roomName: $('#newRoomName').val()
        };
        $.post('/room/add', data, function(res) {
            if (res.err) {
                showMessage(target, res.err, 'danger');
            } else {
                showMessage(target, 'You have been created a new room! Redirecting inside...', 'success');
                setTimeout(function () {
                    location.href = res.url;
                }, 2000);
            }
        }, 'json');
    });
    $('#joinRoom').on('click', function() {
        var selectedRoom = $('#rooms').val();
        if (selectedRoom) {
            location.href = '/chat?roomId=' + selectedRoom;
        }
    });
});