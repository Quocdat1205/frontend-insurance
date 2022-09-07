import * as types from 'redux/actions/types'
import { Action } from 'types/types'

const initialState = {
    assetsToken: [],
}
const setting = (state = initialState, action: Action) => {
    switch (action.type) {
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
