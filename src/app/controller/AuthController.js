const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
    return (jwt.sign({
        username: user.username,
        id: user._id
    }, process.env.GENERATE_ACCESS_TOKEN_KEY, { expiresIn: '1d' }))
}

const generateRefreshToken = (user) => {
    return (jwt.sign({
        username: user.username,
        id: user._id
    }, process.env.GENERATE_REFRESH_TOKEN_KEY, { expiresIn: '30d' }))
}

let refreshTokens = []

class AuthController {
    //[POST] v1/auth/register
    register = async (req, res, next) => {
        try {
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })
            newUser.save()
                .then(async (user) => {
                    const accessToken = generateAccessToken(user)
                    const refreshToken = generateRefreshToken(user)
                    refreshTokens.push(refreshToken)
                    await res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None'
                    })
                    console.log('Cookie added!')
                    const { password, ...others } = user._doc
                    res.status(200).json({ others, accessToken })
                })
                .catch(next);
        } catch (error) {
            res.status(403).json("Resgister Error!!", error)
        }
    }

    //[POST] v1/auth/login
    login = async (req, res, next) => {
        try {
            User.findOne({ email: req.body.email })
                .then(async (user) => {
                    let resContent = {
                        typeError: "Error"
                    }
                    // check username
                    if (!user) {
                        resContent.errorMessage = "Email is incorrect!!"
                        resContent.errorField = "email"
                        return res.status(403).json(resContent)
                    }

                    // check password
                    const userPassword = bcrypt.compareSync(req.body.password, user.password)
                    if (!userPassword) {
                        resContent.errorMessage = "Password is incorrect"
                        resContent.errorField = "password"
                        return res.status(403).json(resContent)
                    }

                    //generate token
                    if (user && userPassword) {
                        const accessToken = generateAccessToken(user)
                        const refreshToken = generateRefreshToken(user)
                        refreshTokens.push(refreshToken)
                        await res.cookie('refreshToken', refreshToken, {
                            httpOnly: true,
                            secure: true, // Produc -> true
                            sameSite: 'None'
                        })
                        console.log('Cookie added!')
                        const { password, ...others } = user._doc
                        res.status(200).json({ others, accessToken })
                    }
                })
        } catch (error) {
            res.status(403).json("Login Error!!", error)
        }
    }

    //[POST] v1/auth/refresh
    refresh = async (req, res, next) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(403).json("You are not authenticated!!!")
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Token is not valid!!!")
        }
        jwt.verify(refreshToken, process.env.GENERATE_REFRESH_TOKEN_KEY, async (err, user) => {
            if (err) {
                res.status(403).json('Decoded Error', err)
            } else {
                refreshTokens.filter(token => token !== refreshToken)
                // Create new access token
                const newAccessToken = generateAccessToken(user)
                // Create new refresh token
                const newRefreshToken = generateRefreshToken(user)
                await res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: true, // Produc -> true
                    sameSite: 'None'
                })
                refreshTokens.push(newRefreshToken)
                return res.status(200).json({ newAccessToken: newAccessToken })
            }
        })
    }

    //[POST] v1/auth/logout
    logout(req, res, next) {
        const refreshToken = req.cookies.refreshToken
        refreshTokens.filter(token => token !== refreshToken)
        res.clearCookie('refreshToken')
        res.status(200).json('Logout successful!!!')
    }

    //[POST] v1/auth/findUser
    findUser(req, res, next) {
        try {
            User.findOne({ email: req.body.email })
                .then(user => {
                    if (user) {
                        res.status(200).json({'userId': user._id})
                    } else {
                        res.status(200).json({'userId': null})
                    }
                })
                .catch(next)
        } catch (error) {
            res.status(403).json("FindUser Error!!", error)
        }
    }
}

module.exports = new AuthController
