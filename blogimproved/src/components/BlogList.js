import { connect } from 'react-redux'
import React from 'react'
import Blog from './Blog'
import NewBlog from './NewBlog'
import Toggable from './Toggable'
import { createNewBlog, deleteBlog, likeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogList = (props) => {

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const createBlog = async (blog) => {
    // TODO: check why the user is undefined directly after creating a blog. This poses problems for liking a blog
    blogFormRef.current.toggleVisibility()
    props.createNewBlog(blog)
    props.setNotification(`a new blog ${blog.title} by ${blog.author} added`)
  }

  const deleteHandler = async (blog) => {
    if (!window.confirm(`Do you really want to remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    try {
      props.deleteBlog(blog.id)
    } catch (exception) {
      console.log(exception)
    }
    props.setNotification(`blog ${blog.title} by ${blog.author} removed!`, 'error')
  }

  const likeHandler = async (blog) => {
    console.log(props)
    console.log(blog)
    try {
      const liked = props.blogs.find(b => b.id === blog.id)
      props.likeBlog(liked)
      props.setNotification(`blog ${liked.title} by ${liked.author} liked!`)
    } catch (exception) {
      console.log(exception)
    }
  }

  const blogFormRef = React.createRef()
  return (
    <div>
      <Toggable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Toggable>
      <h2>blogs</h2>
      {props.blogs.sort(byLikes).map(blog =>
        <Blog key={blog.id}
          blog={blog}
          likeHandler={likeHandler}
          deleteHandler={deleteHandler}
          user={props.user} />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    notification: state.notification,
    user: state.user
  }
}

const mapDispatchToProps = {
  createNewBlog,
  deleteBlog,
  likeBlog,
  setNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogList)
