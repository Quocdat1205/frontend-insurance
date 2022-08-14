// import {
//     configureStore,
//     ThunkDispatch,
//     ThunkAction,
//     combineReducers,
//     AnyAction
// } from '@reduxjs/toolkit';
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// import rootReducer from 'redux/reducers/rootReducer';

// const store = configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => {
//         // if (process.env.NODE_ENV === 'development') {
//         //     const { logger } = require(`redux-logger`);
//         //     return getDefaultMiddleware().concat(logger);
//         // }
//         return getDefaultMiddleware();
//     },
//     devTools: process.env.NODE_ENV === 'development'
// });

// export type StoreState = ReturnType<typeof store.getState>;
// export type ReduxState = ReturnType<typeof store.getState>;
// export type StoreDispatch = typeof store.dispatch;
// export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
// export type TypedThunk<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, AnyAction>;

// export const useAppDispatch = () => useDispatch<TypedDispatch>();
// export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

// export default store;
import rootReducer from 'redux/reducers/rootReducer';
import { applyMiddleware, createStore, compose, AnyAction } from 'redux'
import loggerMiddleware from 'redux/loggerMiddleware';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import Config from 'config/config';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';


let composeEnhancers = compose;
const middleware = [thunkMiddleware];
if (Config.env.NODE_ENV !== 'production') {
    composeEnhancers = Config.client ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose : compose;
    middleware.push(loggerMiddleware)
}
const middlewareEnhancer = applyMiddleware(...middleware)
const store = createStore(rootReducer, composeEnhancers(middlewareEnhancer))
export type StoreState = ReturnType<typeof store.getState>;
export type ReduxState = ReturnType<typeof store.getState>;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export type RootStore = ReturnType<typeof rootReducer>;
export const useAppDispatch = () => useDispatch<TypedDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;