const notificationReducer = (state = { message: null }, action) => {
  console.log(`action type: ${action.type}`)
  switch (action.type) {
  case 'SET_NOTIFICATION':
    console.log(action.data)
    return action.data
  case 'REMOVE_NOTIFICATION':
    return { message: null }
  default:
    return state
  }
}

export const setNotification = ({ message, type }) => {
  console.log(message)
  console.log(`set notif called message: ${message} and type: ${type}`)
  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        message,
        type
      }
    })
  }
}

export const removeNotification = () => {
  return async (dispatch) => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
    })
  }
}

export default notificationReducer