import { combineReducers } from 'redux'

import setting from 'redux/reducers/setting'

import { authSlice } from '../auth/authReducer'

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  setting,
})

export default rootReducer
