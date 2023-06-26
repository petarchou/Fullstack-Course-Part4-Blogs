const app = require('./app');
const config = require('./utils/config')


app.listen(config.PORT);
console.log(`App running at port ${config.PORT}`);