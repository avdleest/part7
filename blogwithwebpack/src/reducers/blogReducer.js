import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'DELETE_BLOG':
    return state.filter(existingBlog => existingBlog.id !== action.id)
  case 'LIKE_BLOG':
    return state.map(b => b.id !== action.data.id ? b : action.data)
  case 'COMMENT_BLOG':
    return state.map(b => b.id !== action.data.id ? b : action.data)
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createNewBlog = (content) => {
  return async (dispatch) => {
    try {
      const data = await blogService.create(content)
      dispatch({
        type: 'NEW_BLOG',
        data
      })
    } catch (exception) {
      if (exception.response && exception.response.data.error) {
        return `server error: ${exception.response.data.error}`
      } else if (exception.message) {
        return exception.message
      }
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.del(id)
    dispatch({
      type: 'DELETE_BLOG',
      id
    })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const liked = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const data = await blogService.update(liked)
    dispatch({
      type: 'LIKE_BLOG',
      data
    })
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const data = await blogService.comment(id, { comment })
    dispatch({
      type: 'COMMENT_BLOG',
      data
    })
  }
}

export default blogReducer