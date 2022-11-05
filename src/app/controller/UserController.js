const User = require('../models/User')
const bcrypt = require('bcryptjs')

class UserController {
    //[PUT] v1/user/:id/update/password
    updatePassword = async (req, res, next) => {
        try {
            User.findOne({ _id: req.params.id })
                .then(async (user) => {
                    const userPassword = bcrypt.compareSync(req.body.password, user.password)
                    if (userPassword) {
                        const salt = await bcrypt.genSalt(10)
                        const hashedPassword = bcrypt.hashSync(req.body.newPassword, salt)
                        User.updateOne({ _id: req.params.id }, { password: hashedPassword })
                            .then(state => res.status(200).json(state))
                            .catch(next);
                    } else {
                        res.status(403).json({ Error: 'Current password wrong' })
                    }
                })
                .catch(next)
        } catch (error) {
            res.status(403).json("Update Password Error!!", error)
        }
    }

    //[PUT] v1/user/:id/update/member
    updateMember(req, res, next) {
        User.updateOne({ _id: req.params.id }, req.body)
            .then(state => res.status(200).json(state))
            .catch(next)
    }
}

module.exports = new UserController;