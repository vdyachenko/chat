/**
 * JS file for login page
 */

$(document).ready(function() {
    /**
     * Login button click handler
     */
    $('#LoginButton').on('click', function() {
        // message block
        var target = $('#messageBlock');
        // clear old messages
        showMessage(target, '');
        // get form data
        var usernameVal = $('input[name="username"]').val();
        var passwordVal = $('input[name="password"]').val();
        if (usernameVal === '' || passwordVal === '') {
            showMessage(target, 'Please, fill username and password fields', 'danger');
            return false;
        }
        var userData = {
          username: usernameVal,
          password: passwordVal,
        };
        $.post('/login', userData, function(res) {
            if (res.err) {
                showMessage(target, res.err, 'danger');
            } else {
                showMessage(target, 'Welcome back! Redirecting to chat...', 'success');
                setTimeout(function () {
                    location.href = res.url;
                }, 2000);
            }
        }, 'json');
    });
});