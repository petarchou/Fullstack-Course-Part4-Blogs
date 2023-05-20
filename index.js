const app = require('./app');
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')


mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI)
    .then(response => logger.info('Connected to mongoDB'))
    .catch(err => {
        logger.error('Connection to mongoDB failed.');
        logger.error(err.message);
        process.exit(1);
    })


app.listen(config.PORT);
console.log(`App running at port ${config.PORT}`);