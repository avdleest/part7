import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import { useField } from './hooks'
import { connect } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { setUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/allUsersReducer'


const App = (props) => {
  const [username, userReset] = useField('text')
  const [password, passwordReset] = useField('password')

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
        <Route exact path='/users' render={() => <Users />} />
        <Route exact path='/users/:id' render={({ match }) => <User user={userById(match.params.id)} />} />
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
    user: state.user,
    users: state.allUsers
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