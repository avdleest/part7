import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Toggable from './components/Toggable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { useField } from './hooks'
import { connect } from 'react-redux'
import { initializeBlogs, createNewBlog, deleteBlog, likeBlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { setUser, logoutUser } from './reducers/userReducer'


const App = (props) => {
  const [username, userReset] = useField('text')
  const [password, passwordReset] = useField('password')

  useEffect(() => {
    props.initializeBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      props.setUser(user)
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
      props.setUser(user)
      userReset()
      passwordReset()
    } catch (exception) {
      console.log('wrong credentials')
      passwordReset()
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    props.logoutUser()
  }

  const blogFormRef = React.createRef()

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const createBlog = async (blog) => {
    // TODO: check why the user is undefined directly after creating a blog. This poses problems for liking a blog
    blogFormRef.current.toggleVisibility()
    props.createNewBlog(blog)
    props.setNotification(`a new blog ${blog.title} by ${blog.author} added`)
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
    props.setNotification(`blog ${blog.title} by ${blog.author} removed!`, 'error')
  }

  const likeHandler = async blog => {
    try {
      const liked = props.blogs.find(b => b.id === blog.id)
      props.likeBlog(liked)
      props.setNotification(`blog ${liked.title} by ${liked.author} liked!`)
    } catch (exception) {
      console.log(exception)
    }
  }

  const BlogList = () =>
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

  const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
      //TODO: implement some try/catch patterns
      let isSubscribed = true
      const getUsers = async () => {
        const users = await userService.getAll()
        if (isSubscribed) setUsers(users)
      }
      getUsers()

      return () => isSubscribed = false

    }, [])

    return (
      <div>
        <h2>Users</h2>
        <table id='users'>
          <tbody>
            <tr>
              <th></th>
              <th>Blogs created</th>
            </tr>
            {users.map(user =>
              <tr key={user.id}>
                <td>
                  {user.name}
                </td>
                <td>
                  {user.blogs.length}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  if (props.user === null) {
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
      <Router>
        <p>{props.user.name} logged in<button type="logout" onClick={handleLogout}>logout</button></p>
        <Notification />
        <Route exact path='/' render={() => <BlogList />} />
        <Route path='/users' render={() => <Users />} />
      </Router>
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
  initializeBlogs,
  createNewBlog,
  deleteBlog,
  likeBlog,
  setNotification,
  setUser,
  logoutUser
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)