import Config from 'config/config'
import { Dispatch } from 'redux'
import * as types from 'redux/actions/types'
import { API_GET_LIST_TOKEN, API_GET_CONFIG_ASSET, API_GET_UNIT_CONFIG, API_GET_GET_TOKEN } from 'services/apis'
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
        const address = localStorage.getItem('PUBLIC_ADDRESS')
        const wallet = localStorage.getItem('PUBLIC_WALLET')
        const token_cookie = localStorage.getItem('PUBLIC_TOKEN_COOKIE')
        if (token_cookie) {
            Config.token.token = token_cookie
        }
        if (address && wallet) {
            dispatch({
                type: types.SET_ACCOUNT,
                payload: { address, wallet },
            })
        }
    } catch (error) {
        console.log('setAccount', error)
    }
}

export const setAccount = (data?: { address: string | null | undefined; wallet?: string | null | undefined }) => async (dispatch: Dispatch) => {
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
        const {data} = await fetchApi({ url: API_GET_LIST_TOKEN })
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
