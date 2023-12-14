const mongoose = require('mongoose')
const app = require('../app.js')
const Blog  = require('../models/blog.js')
const helper = require('./test_helper.js')
const supertest = require('supertest')
const blog = require('../models/blog.js')

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

test('blogs should have id as unique parameter', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
})

test('POST /api/blogs creates a new post', async () => {
    const prePostBlogSize = (await api.get('/api/blogs')).body.length;

    const response = await api.post('/api/blogs')
    .send(helper.initialBlogs[0])
    .set('Content-Type', 'application/json')
    const afterPostBlogSize = (await api.get('/api/blogs')).body.length;
    
    expect(response.statusCode).toEqual(201);
    expect(afterPostBlogSize).toEqual(prePostBlogSize+1);
})

test("POST api/blogs with missing title/url returns 400", async() => {
    const invalidBlog = {...helper.initialBlogs[0]};
    delete invalidBlog.title
    const response = await api.post('/api/blogs')
        .send(invalidBlog)
        .set('Content-Type', 'application/json')
    expect(response.statusCode).toEqual(400);
})

test('default likes value is 0 when creating blog', async () => {
    const blog = {...helper.initialBlogs[0]};
    delete blog.likes

    const response = await api.post('/api/blogs')
    .send(blog)
    .set('Content-Type', 'application/json')

    expect(response.body.likes).toEqual(0)
} )

test("DELETE api/blogs/:id with invalid id returns 400", async() => {
    const response = await api.delete('/api/blogs/randomId')
    .send()
    .set('Content-Type', 'application/json')

    expect(response.statusCode).toEqual(400)
})

test("DELETE api/blogs/:id valid id deletes and returns 204", async() => {
    const blog = await Blog.findOne()
    const blogsBefore = await Blog.count()
    const response = await api.delete('/api/blogs/' + blog.id)
    .send()
    .set('Content-Type', 'application/json')

    const blogsAfter = await Blog.count()
    console.log('Blogs after: ', blogsAfter)

    expect(blogsBefore).toEqual(blogsAfter+1)
    expect(response.statusCode).toEqual(204)
})

test('PUT api/blogs/:id with invalid id returns 400', async() => {
    const response = await api.put('/api/blogs/randomId')
    .send()
    .set('Content-Type', 'application/json')

    expect(response.statusCode).toEqual(400)
})

test('PUT api/blogs/:id with non-existent id returns 404 and proper message', async () => {
    const blog = await Blog.findOne()
    const id = '0'.repeat(blog.id.length)
    const response = await api.put('/api/blogs/' + id)

    const expectedMessage = "No blog found with ID " + id;
    expect(response.body.message).toEqual(expectedMessage)
})

test('PUT api/blogs/:id valid id updates, returns 200 and returns updated entity', async() => {
    const blogId = (await Blog.findOne()).id
    const body = {
        likes: 1
    }
    const response = await api.put('/api/blogs/'+ blogId)
    .send(body)
    .set('Content-Type', 'application/json')

    console.log('Body is: ', response.body)

    expect(response.body.likes).toEqual(1)
    expect(response.statusCode).toEqual(200)
})



afterAll(async () => {
    await mongoose.connection.close()
})

