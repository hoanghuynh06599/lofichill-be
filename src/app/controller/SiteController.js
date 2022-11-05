
class SiteController {
    // [GET] /
    home(req, res, next) {
        res.send('Hello Guys')
    }
}

module.exports = new SiteController
