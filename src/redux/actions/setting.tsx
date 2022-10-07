import Config from 'config/config'
import { Dispatch } from 'redux'
import * as types from 'redux/actions/types'
import { API_GET_LIST_TOKEN, API_GET_CONFIG_ASSET, API_GET_UNIT_CONFIG, API_GET_INFO_USER } from 'services/apis'
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

export const setting = () => async (dispatch: Dispatch) => {
    try {
        const address = sessionStorage.getItem('PUBLIC_ADDRESS')
        const wallet = sessionStorage.getItem('PUBLIC_WALLET')
        if (address && wallet) {
            const { data } = await fetchApi({ url: API_GET_INFO_USER, params: { owner: address } })
            dispatch({
                type: types.SET_ACCOUNT,
                payload: { address, wallet, ...data },
            })
        }
    } catch (error) {
        console.log('setAccount', error)
    }
}

export const setAccount =
    (data?: { address: string | null | undefined; wallet?: string | null | undefined; [key: string]: any }) => async (dispatch: Dispatch) => {
        try {
            dispatch({
                type: types.SET_ACCOUNT,
                payload: data,
            })
        } catch (error) {
            console.log('setAccount', error)
        }
    }

export const getListAssetToken = () => async (dispatch: Dispatch) => {
    try {
        const { data } = await fetchApi({ url: API_GET_LIST_TOKEN })
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
