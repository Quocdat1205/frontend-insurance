import { wallets } from 'components/web3/Web3Types'
import env from 'config/env'
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

    static homeMenu = [
        { menuId: 'home', router: '/home', name: 'common:header:home', parentId: 0 },
        { menuId: 'buy-covered-parent', router: '/buy-covered', name: 'common:header:buy_covered', parentId: 0 },
        {
            menuId: 'buy-covered',
            router: '/buy-covered',
            name: 'common:header:buy_covered',
            parentId: 'buy-covered-parent',
            icon: '/images/icons/ic_menu_buy_covered.png',
        },
        {
            menuId: 'insurance-history',
            router: '/buy-covered/insurance-history',
            name: 'common:header:insurance_history',
            parentId: 'buy-covered-parent',
            icon: '/images/icons/Ic_menu_users.png',
        },
    ]
}

export default Config
