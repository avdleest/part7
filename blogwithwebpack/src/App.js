import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Users from './components/Users'
import Blog from './components/Blog'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'
import { connect } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { setUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/allUsersReducer'
import { Menu, Button } from 'semantic-ui-react'


const App = (props) => {
  const [username, userReset] = useField('text', 'username')
  const [password, passwordReset] = useField('password', 'password')

  useEffect(() => {
    props.initializeBlogs()
    props.initializeUsers()
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

  const userById = (id) => props.users.find(user => user.id === id)

  const blogById = (id) => props.blogs.find(blog => blog.id === id)

  if (props.user === null) {
    return (
      <Container>
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
      </Container>
    )
  }

  return (
    <Container>
      <Router>
        <Menu>
          <Menu.Item><Link to='/'>Blogs</Link></Menu.Item>
          <Menu.Item><Link to='/users'>Users</Link></Menu.Item>
          <Menu.Item>{'   '}{props.user.name} logged in {'   '}<Button size='mini' type="logout" onClick={handleLogout}>logout</Button></Menu.Item>
        </Menu>
        <Notification />
        <Route exact path='/' render={() => <BlogList />} />
        <Route exact path='/users' render={() => <Users />} />
        <Route exact path='/users/:id' render={({ match }) => <User user={userById(match.params.id)} />} />
        <Route exact path='/blogs/:id' render={({ match }) => <Blog user={props.user} blog={blogById(match.params.id)} />} />
      </Router >
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
    user: state.user,
    users: state.allUsers,
    blogs: state.blogs
  }
}

const mapDispatchToProps = {
  initializeBlogs,
  setNotification,
  setUser,
  logoutUser,
  initializeUsers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)