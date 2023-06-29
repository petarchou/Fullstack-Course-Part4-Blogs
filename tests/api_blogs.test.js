const mongoose = require('mongoose')
const app = require('../app.js')
const Blog  = require('../models/blog.js')
const helper = require('./test_helper.js')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {    
    await Blog.deleteMany({})
    console.log('Cleared database')
    const blogs = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
    console.log('Prepared database for testing')
})

test('api/blogs returns all blogs as expected', async () => {
    const response = await api
    .get('/api/blogs');

    expect(response.body.length).toEqual(helper.initialBlogs.length)
})
afterAll(async () => {
    await mongoose.connection.close()
})

test('blogs should have id as unique parameter', async () => {
    const response = await api.get('/api/blogs');
    console.log(response.body)
    expect(response.body[0].id).toBeDefined();
})

