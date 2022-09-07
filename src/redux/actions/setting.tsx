import { Dispatch } from 'redux'
import * as types from 'redux/actions/types'
import { API_GET_GET_LIST_TOKEN } from 'services/apis'
import fetchApi from 'services/fetch-api'

export const getListAssetToken = () => async (dispatch: Dispatch) => {
    try {
        const data = await fetchApi({ url: API_GET_GET_LIST_TOKEN })
        if (data) {
            dispatch({
                type: types.SET_ASSETS_TOKEN,
                payload: data,
            })
        }
    } catch (error) {
        console.log('getListToken', error)
    }
}
