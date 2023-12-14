const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()
const User = require('../models/user')



usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body
        if (!(username && password)) {
            response.status(400).json({
                error: "Missing required fields: 'username' or 'password'"
            })
            return
        }

        if(!(username.length >=3 && password.length >= 3)) {
            response.status(400).json({
                error: "'username' and 'password' should be atleast 3 characters long"
            })
            return
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response
            .status(201)
            .json({
                savedUser
            })
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})

    response.status(200)
    .json(users)
})


module.exports = usersRouter