import * as types from 'redux/actions/types'
import { Action } from 'types/types'

const initialState = {
    loading: false,
}
const setting = (state = initialState, action: Action) => {
    switch (action.type) {
        case types.LOADING:
            return {
                ...state,
                loading: action.payload,
            }
        default:
            return state
    }
}
export default setting
