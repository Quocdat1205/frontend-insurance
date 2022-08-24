import { Dispatch } from 'redux'

import * as types from 'redux/actions/types'

export const onLoading = (param?: any, cb?: any) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.LOADING,
            payload: param,
        })
        if (cb) cb(param)
    } catch (error) {
        console.log('onLoading', error)
    }
}

export const setProfile = (param?: any, cb?: any) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.PROFILE,
            payload: param,
        })
        if (cb) cb(param)
    } catch (error) {
        console.log('onLoading', error)
    }
}
