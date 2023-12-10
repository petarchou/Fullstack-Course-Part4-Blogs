const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'ValidationError' || error.name === 'CastError') {
        response.status(400).json({error: error.message})
    }
    else {
        response.status(500).send()
    }
    next(error)
}



module.exports = {errorHandler}