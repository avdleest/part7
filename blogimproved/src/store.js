import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import blogReducer from './reducers/blogReducer'
// import notificationReducer from './reducers/notificationReducer'
// import filterReducer from './reducers/filterReducer'

// const reducer = combineReducers({
//   blogs: blogReducer
// })

// const store = createStore(reducer, applyMiddleware(thunk))

const store = createStore(blogReducer, applyMiddleware(thunk))

export default store