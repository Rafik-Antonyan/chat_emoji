const User = require('../models/userModel')
const bcrypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        const usernameCheck = await User.findOne({ username })
        if (usernameCheck) return res.json({ status: false, message: "Username is already used, select another one." })

        const emailCheck = await User.findOne({ email })
        if (emailCheck) return res.json({ status: false, message: "Email is already used, select another one." })

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword
        })
        delete newUser.password
        res.json({ status: true, newUser })
    } catch (err) {
        next(err)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) return res.json({ status: false, message: "Username wasn't defined." })

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) return res.json({ status: false, message: "Wrong password" })

        res.json({ status: true, user })
    } catch (err) {
        next(err)
    }
}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const { image } = req.body
        const { id } = req.params

        await User.findByIdAndUpdate(id, {
            isAvatarImageSet: true,
            avatarImage: image
        })

        const user = await User.findById(id)

        if (!user) {
            res.json({ status: false })
        }

        res.json({ status: true, user })
    } catch (err) {
        next(err)
    }
}

module.exports.allUsers = async (req, res, next) => {
    try {
        const { id } = req.params

        const users = await User.find({ _id: { $ne: id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ])
        res.json({ status: true, users })
    } catch (err) {
        next(err)
    }
}