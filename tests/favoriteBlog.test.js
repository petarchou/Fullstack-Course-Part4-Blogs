const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favoriteBlog', () => {
    const testBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
    }

    test('returns undefined for empty array', () => {
        const blogs = []

        const result = favoriteBlog(blogs)

        expect(result).toEqual(undefined)
    })

    test('returns blog likes==for single blog', () => {
        const blogs = [testBlog]

        const result = favoriteBlog(blogs)

        expect(result).toEqual(testBlog)
    })

    test('returns blog with most likes for multiple blogs', () => {
        const blogs = [testBlog,
            { ...testBlog, likes: 1 },
            { ...testBlog, likes: 29 },
            { ...testBlog, likes: 74 }]

        const result = favoriteBlog(blogs)

        expect(result).toEqual({ ...testBlog, likes: 74 })
    })
})