import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { deleteBlog, likeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = (props) => {
  console.log('user:', props.user)
  const deleteHandler = async (blog) => {
    if (!window.confirm(`Do you really want to remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    try {
      props.deleteBlog(blog.id)
    } catch (exception) {
      console.log(exception)
    }
    props.history.push('/')
    props.setNotification(`blog ${blog.title} by ${blog.author} removed!`, 'error')
  }

  const likeHandler = async (blog) => {
    try {
      const liked = props.blogs.find(b => b.id === blog.id)
      props.likeBlog(liked)
      props.setNotification(`blog ${liked.title} by ${liked.author} liked!`)
    } catch (exception) {
      console.log(exception)
    }
  }

  if (props.blog === undefined) {
    return null
  }

  return (
    <div>
      <h2>{props.blog.title} {props.blog.author}</h2>
      <a href={props.blog.url} target='_blank' rel='noopener noreferrer'>{props.blog.url}</a><br />
      {props.blog.likes} likes
      <button onClick={() => likeHandler(props.blog)}>like</button><br />
      {props.blog.user ? `Added by ${props.blog.user.name}` : ''} <br />
      {props.blog.user.username === props.user.username && (<button onClick={() => deleteHandler(props.blog)}>remove</button>)}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    notification: state.notification,
    blog: ownProps.blog,
    blogs: state.blogs,
    user: ownProps.user
  }
}

const mapDispatchToProps = {
  deleteBlog,
  likeBlog,
  setNotification,
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog))