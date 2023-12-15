

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {

  try {
    const decodedToken = request.decodedToken

    if (!decodedToken) {
      return response
        .status(401)
        .json({ error: 'Invalid or missing token' })
    }

    const user = await User.findById(decodedToken.id)

    const input = {
      ...request.body,
      user: user.id
    }

    const blog = new Blog(input)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    const id = request.params.id

    const result = await Blog.findByIdAndDelete(id)

    if (result) {
      response.status(204).end()
    } else {
      response.status(404).json({
        message: "No blog found with ID " + id
      })
    }

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  try {
    const id = request.params.id;

    const result = await Blog.findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
      context: 'query'
    })

    if (result) {
      response.status(200).json(result)
    } else {
      response.status(404).json({
        message: 'No blog found with ID ' + id
      })
    }
  } catch (error) {
    next(error)
  }

})

module.exports = blogsRouter