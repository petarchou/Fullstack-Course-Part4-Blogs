const totalLikes = require('../utils/list_helper').totalLikes
const Blog = require('../models/blog')

describe('totalLikes', () => {
    const blog = {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0 
    }
    test('return 0 for empty list', () => {
        const blogPosts = []
        const result = totalLikes([])

        expect(result).toBe(0)
    })

    test('for 1 blog post equals its likes', () => {

        const result = totalLikes([blog])

        expect(result).toBe(blog.likes)
    })

    test('of multiple posts is calculated right', () => {
        const blogs = [{...blog},{...blog},{...blog}]

        const result = totalLikes(blogs)
        
        expect(result).toBe(blog.likes*blogs.length)
    })
}) 