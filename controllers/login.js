const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginRouter = require('express').Router()
const User = require('../models/user')



loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body;

    const user = await User.findOne({ username })

    const isCorrectPassword = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!isCorrectPassword) {
        response
            .status(401)
            .json({
                error: 'Invalid username or password'
            })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })

    response
        .status(200)
        .json({
            username: user.username,
            name: user.name,
            token,
        })
})

module.exports = loginRouter