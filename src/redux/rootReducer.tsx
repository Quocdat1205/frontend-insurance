import { combineReducers } from 'redux';
import { authSlice } from './auth/authReducer';

const rootReducer = combineReducers({
    auth: authSlice.reducer
});

export default rootReducer;
