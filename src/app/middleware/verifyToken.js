const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.token
    if(token) {
        const accessToken = token.split(' ')[1]
        jwt.verify(accessToken, process.env.GENERATE_ACCESS_TOKEN_KEY, (err, user) => {
            if(err) {
                res.status(403).json("Token is not valid!!!")
            } else {
                req.user = user
                next()
            }
        })
    } else {
        res.status(403).json("You are not authenticated!!!")
    }
}

module.exports = verifyToken
