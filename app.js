const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger')
const Blog = require('./models/blog');
const blogsRouter = require('./controllers/blog');

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

//add middleware when requested




module.exports = app