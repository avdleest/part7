import { connect } from 'react-redux'
import React from 'react'
import NewBlog from './NewBlog'
import Toggable from './Toggable'
import { createNewBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'


const BlogList = (props) => {

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const createBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    // With the below method, the server can provide the error message for the notification
    const response = await props.createNewBlog(blog)
    response
      ? props.setNotification(response, 'error')
      : props.setNotification(`a new blog ${blog.title} by ${blog.author} added`)
  }

  const blogFormRef = React.createRef()
  return (
    <div>
      <h2>blog app</h2>
      <Toggable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Toggable>
      <Table striped selectable>
        <Table.Body>
          {props.blogs.sort(byLikes).map(blog =>
            <Table.Row key={blog.id}>
              <Table.Cell>
                <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
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
