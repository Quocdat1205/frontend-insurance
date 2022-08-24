import { wallets } from 'components/web3/Web3Types'
import env from 'config/env'
import { Ref } from 'react'
import { Toast } from 'types/types'

class Config {
    static env = env

    static client = typeof window !== 'undefined'
    static toast: Toast
    static alert: Toast
    static web3: any

    static connectWallet = (wallet: string = wallets.metaMask) => {
        Config.web3?.activate(wallet)
    }

    static blogUrl: { nami_exchange: string; nami_today: string } = {
        nami_exchange: 'https://nami.exchange',
        nami_today: 'https://nami.today',
    }

    static pattern = (key: string) => {
        let rs: any = ''
        switch (key) {
            case 'email':
                rs = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
                break
            case 'phone':
                rs = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
                break
            case 'number':
                rs = /^(0|[1-9][0-9]*)$/
                break
            default:
                break
        }
        return rs
    }
}

export default Config
