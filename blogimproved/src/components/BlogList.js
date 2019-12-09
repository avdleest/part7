import { connect } from 'react-redux'
import React from 'react'
import BlogLink from './BlogLink'
import NewBlog from './NewBlog'
import Toggable from './Toggable'
import { createNewBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogList = (props) => {

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const createBlog = async (blog) => {
    // TODO: check why the user is undefined directly after creating a blog. This poses problems for liking a blog
    blogFormRef.current.toggleVisibility()
    props.createNewBlog(blog)
    props.setNotification(`a new blog ${blog.title} by ${blog.author} added`)
  }

  const blogFormRef = React.createRef()
  return (
    <div>
      <h2>blog app</h2>
      <Toggable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Toggable>
      {props.blogs.sort(byLikes).map(blog =>
        <BlogLink key={blog.id}
          blog={blog} />
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
  setNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogList)
