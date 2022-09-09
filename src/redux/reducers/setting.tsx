import * as types from 'redux/actions/types'
import { Action } from 'types/types'

const initialState = {
    loading_account: true,
    assetsToken: [],
}
const setting = (state = initialState, action: Action) => {
    switch (action.type) {
        case types.LOADING_ACCOUNT:
            return {
                ...state,
                loading_account: action.payload,
            }
        case types.SET_ASSETS_TOKEN:
            return {
                ...state,
                assetsToken: action.payload,
            }
        default:
            return state
    }
}
export default setting
