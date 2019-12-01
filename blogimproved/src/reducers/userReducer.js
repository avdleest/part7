const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.data
  case 'REMOVE_USER':
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

export const removeUser = () => {
  return async (dispatch) => {
    dispatch({
      type: 'REMOVE_USER'
    })
  }
}

export default userReducer