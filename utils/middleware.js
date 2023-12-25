/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'ValidationError' || error.name === 'CastError') {
        response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    const token = getTokenFromRequest(request)
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        request.decodedToken = decodedToken
    }
    next()
}

const getTokenFromRequest = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

const userExtractor = async (request, response, next) => {
    const decodedToken = request.decodedToken

    if (!decodedToken) {
        return response
            .status(401)
            .json({ error: 'Invalid or missing token' })
    }

    const user = await User.findById(decodedToken.id)
    request.user = user
    next()
}



module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor,
}