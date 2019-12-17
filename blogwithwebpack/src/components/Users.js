import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import React from 'react'

const Users = (props) => {

  return (
    <div>
      <h2>Users</h2>
      <table id='users'>
        <tbody>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
          {props.users.map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
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

const mapStateToProps = (state) => {
  return {
    users: state.allUsers
  }
}

export default connect(
  mapStateToProps,
  null
)(Users)