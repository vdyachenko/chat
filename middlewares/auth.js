
/**
 * Checking whether user is logged or not
 *
 * @param req
 * @param res
 * @param next
 */
module.exports = function (req, res, next) {
    if (req.session.loggedUser) {
        next();
    } else {
        res.redirect('/login');
    }
};