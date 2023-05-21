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
    if(blogs.length === 0) {
        return undefined
    }
    const reducer = (prev, curr) => {
        if(prev.likes < curr.likes) {
            return curr
        }
        return prev
    }

    const favoriteBlog = blogs.reduce(reducer, {likes: -1})

    return favoriteBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}
