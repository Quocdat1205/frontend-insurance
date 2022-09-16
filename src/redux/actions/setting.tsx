import { Dispatch } from 'redux'
import * as types from 'redux/actions/types'
import { API_GET_LIST_TOKEN, API_GET_CONFIG_ASSET, API_GET_UNIT_CONFIG } from 'services/apis'
import fetchApi from 'services/fetch-api'

export const onLoading = (data: boolean) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: types.LOADING_ACCOUNT,
            payload: data,
        })
    } catch (error) {
        console.log('onLoading', error)
    }
}

export const getListAssetToken = () => async (dispatch: Dispatch) => {
    try {
        const data = await fetchApi({ url: API_GET_LIST_TOKEN })
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

export const getConfigAsset = () => async (dispatch: Dispatch) => {
    try {
        const { data } = await fetchApi({ url: API_GET_CONFIG_ASSET })
        if (data) {
            dispatch({
                type: types.SET_CONFIG_ASSET,
                payload: data,
            })
        }
    } catch (error) {
        console.log('getConfigAsset', error)
    }
}

export const getConfigUnit = () => async (dispatch: Dispatch) => {
    try {
        const { data } = await fetchApi({ url: API_GET_UNIT_CONFIG, baseURL: '' })
        if (data) {
            dispatch({
                type: types.SET_CONFIG_UNIT,
                payload: data,
            })
        }
    } catch (error) {
        console.log('getConfigUnit', error)
    }
}
