const blogsRouter = require('express').Router();
const Blog = require('../models/blog');


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}) 
  response.json(blogs)
  })

blogsRouter.post('/', async (request, response, next) => {

  try {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  try {
    const id = request.params.id

    const result = await Blog.findByIdAndDelete(id)

    if(result) {
      response.status(204).end()
    } else {
      response.status(404).json({
        message: "No blog found with ID " + id
      })
    }

  } catch(error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  
  try{
  const id = request.params.id;

  const result = await Blog.findByIdAndUpdate(id, request.body, {
    new: true,
    runValidators: true,
    context: 'query'
  })

  if(result) {
    response.status(200).json(result)
  } else {
    response.status(404).json({
      message: 'No blog found with ID ' + id
    })
  }
} catch(error) {
  next(error)
}

})

  module.exports = blogsRouter