import * as types from 'redux/actions/types'
import { Action } from 'types/types'

const initialState = {
    account: {
        address: null,
        wallet: null,
    },
    loading_account: true,
    assetsToken: [],
    pairConfigs: [],
    unitConfig: [],
}
const setting = (state = initialState, action: Action) => {
    switch (action.type) {
        case types.SET_ACCOUNT:
            return {
                ...state,
                account: {
                    ...state.account,
                    ...action.payload,
                },
            }
        case types.LOADING_ACCOUNT:
            return {
                ...state,
                loading_account: action.payload,
            }
        case types.SET_ASSETS_TOKEN:
            return {
                ...state,
                assetsToken: action.payload ?? [],
            }
        case types.SET_CONFIG_ASSET:
            return {
                ...state,
                pairConfigs: action.payload ?? [],
            }
        case types.SET_CONFIG_UNIT:
            return {
                ...state,
                unitConfig: action.payload ?? [],
            }
        default:
            return state
    }
}
export default setting
