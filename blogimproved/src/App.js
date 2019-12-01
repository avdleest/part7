import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Toggable from './components/Toggable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'
import { connect } from 'react-redux'
import { initializeBlogs, createNewBlog, deleteBlog, likeBlog } from './reducers/blogReducer'


const App = (props) => {
  const [user, setUser] = useState(null)
  const [username] = useField('text')
  const [password] = useField('password')
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    props.initializeBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(
        { username: username.value, password: password.value }
      )
      console.log(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
    } catch (exception) {
      console.log('wrong credentials')
      password.reset()
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogFormRef = React.createRef()

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const createBlog = async (blog) => {
    // TODO: check why the user is undefined directly after creating a blog. This poses problems for liking a blog
    blogFormRef.current.toggleVisibility()
    props.createNewBlog(blog)
    notify(`a new blog ${blog.title} by ${blog.author} added`)
  }

  const deleteHandler = async blog => {
    if (!window.confirm(`Do you really want to remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    try {
      props.deleteBlog(blog.id)
    } catch (exception) {
      console.log(exception)
    }
    notify(`blog ${blog.title} by ${blog.author} removed!`)
  }

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null }), 10000)
  }

  const likeHandler = async blog => {
    try {
      const liked = props.blogs.find(b => b.id === blog.id)
      props.likeBlog(liked)
      notify(`blog ${liked.title} by ${liked.author} liked!`)
    } catch (exception) {
      console.log(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input {...username} />
          </div>
          <div>
            password
            <input {...password} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <p>{user.name} logged in<button type="logout" onClick={handleLogout}>logout</button></p>
      <Toggable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog} />
      </Toggable>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {props.blogs.sort(byLikes).map(blog =>
        <Blog key={blog.id}
          blog={blog}
          likeHandler={likeHandler}
          deleteHandler={deleteHandler}
          user={user} />
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  createNewBlog,
  deleteBlog,
  likeBlog
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)