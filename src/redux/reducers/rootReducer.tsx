import { combineReducers } from 'redux'
import setting from 'redux/reducers/setting'
import socket from 'redux/reducers/socket'

const rootReducer = combineReducers({
    setting,
    socket,
})

export default rootReducer
