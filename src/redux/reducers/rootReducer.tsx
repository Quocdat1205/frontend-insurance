import { combineReducers } from 'redux';
import { authSlice } from '../auth/authReducer';
import setting from 'redux/reducers/setting';

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    setting: setting
});

export default rootReducer;
