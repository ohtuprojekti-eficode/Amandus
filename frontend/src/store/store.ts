import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import fileReducer from './reducers/files'

const rootReducer = combineReducers({
  files: fileReducer,
})

export default function configureStore() {
  return createStore(rootReducer, applyMiddleware(thunk))
}
