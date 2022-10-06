import io from 'socket.io-client'
import * as types from 'redux/actions/types'
import { Dispatch } from 'redux'
import Config from 'config/config'
import { PublicSocketEvent } from 'socket/socketEvent'
import Emitter from 'socket/emitter'

let WS: any

const initPublicSocket = () => {
    return (dispatch: Dispatch) => {
        WS = io(Config.env.PUBLIC_SOCKET, {
            // transports: ['websocket'],
            transports: ['websocket'],
            upgrade: false,
            path: '/ws',
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 500,
            reconnectionAttempts: Infinity,
        })
        WS.on('connect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: WS,
            })

            WS.on(PublicSocketEvent.FUTURES_TICKER_UPDATE, (data: any) => {
                Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE + data.s, data)
                Emitter.emit(PublicSocketEvent.FUTURES_TICKER_UPDATE, data)
            })

            WS.on(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE, (data: any) => {
                Emitter.emit(PublicSocketEvent.FUTURES_MINI_TICKER_UPDATE + data.s, data)
            })
        })

        // WS.on('reconnect', () => {
        //     dispatch(reloadData())
        // })

        WS.on('disconnect', () => {
            dispatch({
                type: types.SET_PUBLIC_SOCKET,
                payload: null,
            })
        })
    }
}

export function reconnectPublicSocket() {
    if (typeof WS.reconnect === 'function') {
        WS.reconnect()
    }
}

export default initPublicSocket
