const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogPosts) => {
    const reducer = (prev, curr) => prev + curr;

    return blogPosts
        .map(blogPost => blogPost.likes)
        .reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }
    const reducer = (prev, curr) => {
        if (prev.likes < curr.likes) {
            return curr
        }
        return prev
    }

    const favoriteBlog = blogs.reduce(reducer, { likes: -1 })

    return favoriteBlog
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const counted = _.countBy(blogs, (blog) => blog.author)

    const authoredBlogs = _.map(counted, (value, key) => {
        return {
            author: key,
            blogs: value
        }
    })

    const mostBlogsAuthor = _.maxBy(authoredBlogs, blog => blog.blogs)

    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    if (blogs.length === 0)
        return undefined

    let authorLikes = _.reduce(blogs, (result, blog) => {
        const {author, likes} = blog
        result[author] = (result[author] || 0) + likes
        return result
    }, {})

    authorLikes = _.map(authorLikes, (value, key) => {
        return {
            author: key,
            likes: value
        }
    })

    return _.maxBy(authorLikes, (author) => author.likes)

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
