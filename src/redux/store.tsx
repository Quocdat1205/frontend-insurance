import { applyMiddleware, createStore, compose, AnyAction } from 'redux'
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import rootReducer from 'redux/reducers/rootReducer'
import loggerMiddleware from 'redux/loggerMiddleware'
import Config from 'config/config'

let composeEnhancers = compose
const middleware = [thunkMiddleware]
if (Config.env.NODE_ENV !== 'production') {
  composeEnhancers = Config.client
    ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose)
    : compose
  middleware.push(loggerMiddleware)
}
const middlewareEnhancer = applyMiddleware(...middleware)
const store = createStore(rootReducer, composeEnhancers(middlewareEnhancer))
export type StoreState = ReturnType<typeof store.getState>
export type ReduxState = ReturnType<typeof store.getState>
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>
export type RootStore = ReturnType<typeof rootReducer>
export const useAppDispatch = () => useDispatch<TypedDispatch>()
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector
export default store
