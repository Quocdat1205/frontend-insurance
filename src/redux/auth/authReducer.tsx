import { createSlice } from '@reduxjs/toolkit';
import { loginAction } from './authActions';

const initialState = {
    token: '',
    loading: false
};
export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loginAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.loading = false;
            console.log('action.payload', action.payload);
            if (!action.payload) return;
            state.token = action.payload;
        });
    }
});
