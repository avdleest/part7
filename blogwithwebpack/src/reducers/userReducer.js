const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
  case 'LOGOUT_USER':
    return null
  default:
    return state
  }
}

export const setUser = ({ username, name, password, token }) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_USER',
      data: {
        username,
        name,
        password,
        token
      }
    })
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({
      type: 'LOGOUT_USER'
    })
  }
}

export default userReducer