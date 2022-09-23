import { BasicChainInformation, ExtendedChainInformation, wallets } from 'components/web3/Web3Types'
import env from 'config/env'
import { ConnectWalletType, Toast } from 'types/types'

class Config {
    static env = env

    static client = typeof window !== 'undefined'
    static toast: Toast
    static alert: Toast
    static web3: any
    static refConnectWallet: ConnectWalletType

    static connectWallet = (wallet: string = wallets.metaMask) => {
        Config.refConnectWallet.show()
    }

    static chains = String(Config.env.CHAINS)
        .split(',')
        .map((chain) => Number(chain))

    static networks: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
        1: {
            urls: ['https://mainnet.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'],
            name: 'Mainnet',
        },
        4: {
            urls: ['https://rinkeby.infura.io/v3/f87b967bc65a41c0a1a25635493fa482'],
            name: 'Rinkeby',
        },
        42: {
            urls: ['https://kovan.infura.io/ws/v3/f87b967bc65a41c0a1a25635493fa482'],
            name: 'Kovan',
        },
        97: {
            urls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
            name: 'bscTestnet',
        },
        56: {
            urls: ['https://bsc-dataseed.binance.org'],
            name: 'mainnet',
        },
        69: {
            urls: ['https://kovan-optimistic.etherscan.io'],
            name: 'Optimism Kovan (testnet)',
        },
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
