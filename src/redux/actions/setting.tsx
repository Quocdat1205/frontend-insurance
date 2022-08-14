import { Dispatch } from 'redux'

import * as types from 'redux/actions/types'

export const onLoading =
  (param?: any, cb?: any) => async (dispatch: Dispatch) => {
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
