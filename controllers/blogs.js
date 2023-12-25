

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    .populate('likesList', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {

  try {
    const user = request.user

    const input = {
      ...request.body,
      user: user.id,
    }

    const blog = new Blog(input)
    await blog.save()

    const savedBlog = await Blog.findById(blog._id).populate('user', { username: 1, name: 1, id: 1 })
      .populate('likesList', { username: 1, name: 1, id: 1 })

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {

  try {
    const user = request.user

    const id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
      return response
        .status(404)
        .json({ message: 'No blog found with ID ' + id })
    }

    if (blog.user.toString() !== user.id) {
      return response
        .status(401)
        .json({ error: 'Only the blog creator can delete a blog' })
    }

    const result = await Blog.deleteOne({ _id: id })

    if (result) {
      response.status(204).end()
    }

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {

  try {
    const id = request.params.id
    const user = request.user

    const foundBlog = await Blog.findById(id)
    const like = request.body.like

    console.log(foundBlog.likesList, ' - initial likesList')

    delete request.body.likesList

    const hasAlreadyLiked = await Blog.exists({
      _id: foundBlog._id,
      likesList: { $in: [user.id] }
    })

    console.log('has liked = ', hasAlreadyLiked)

    if (like == 1 && !hasAlreadyLiked) {
      request.body.likesList = foundBlog.likesList.concat(user._id)
    } else if (like == 0 && hasAlreadyLiked) {
      request.body.likesList = foundBlog.likesList.filter(userId => userId != user.id)
    }

    console.log(`updated likesList - ${request.body.likesList}`)
    console.log('im here')
    const result = await Blog.findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
      context: 'query'
    }).populate('user', { username: 1, name: 1, id: 1 })
      .populate('likesList', { username: 1, name: 1 })

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