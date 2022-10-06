import * as types from 'redux/actions/types'
import { Action } from 'types/types'

const initialState = {
    publicSocket: null,
}
const setting = (state = initialState, action: Action) => {
    switch (action.type) {
        case types.SET_PUBLIC_SOCKET:
            return {
                ...state,
                publicSocket: action.payload,
            }
        default:
            return state
    }
}
export default setting
