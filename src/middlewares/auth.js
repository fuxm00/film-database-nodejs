export default (req, res, next) => {
    if (res.locals.users) {
        next()
    } else {
        res.redirect('/register')
    }
}
