const mongoose = require('mongoose')
const config = require('./utils/config')
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger')
const blogsController = require('./controllers/blog');
const middleware = require('./utils/middleware')

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI)
    .then(response => logger.info('Connected to mongoDB'))
    .catch(err => {
        logger.error('Connection to mongoDB failed.');
        logger.error(err.message);
        process.exit(1);
    })




app.use(cors());
app.use(express.json());


//API
app.use('/api/blogs', blogsController)

//add middleware when requested
console.log("middleware: ", middleware.errorHandler)
app.use(middleware.errorHandler)




module.exports = app