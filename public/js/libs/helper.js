/**
 * Common functions
 */

/**
 * Show message in selected area
 *
 * @param target
 * @param messages
 * @param type
 */
function showMessage(target, messages, type) {
    var messageTemplate = '<div class="alert" role="alert"></div>';
    if (messages !== '') {
        target.append(messageTemplate);
        var finalText = messages;
        if (finalText instanceof Array) {
            finalText = [];
            for (var message in messages) {
                finalText.push('<li>' + messages[message] + '</li>');
            }
            finalText.join();
        }
        target.find('.alert').addClass('alert-' + type).html(finalText);
    } else {
        target.find('.alert').remove();
    }
}
