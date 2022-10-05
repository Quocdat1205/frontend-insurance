import { DisconnectIcon, EmailIcon, HistoryIcon, UserIcon } from 'components/common/Svg/SvgIcon'
import { BasicChainInformation, ExtendedChainInformation, wallets } from 'components/web3/Web3Types'
import env from 'config/env'
import { ConnectWalletType, Toast } from 'types/types'

class Config {
    static env = env

    static client = typeof window !== 'undefined'

    static toast: Toast

    static alert: Toast

    static token: {
        token: string | null
        expire: number | null
    } = { token: null, expire: null }

    static web3: any

    static refConnectWallet: ConnectWalletType

    static connectWallet = () => {
        Config.refConnectWallet.show()
    }

    static isMetaMaskInstalled = Config.client && Boolean(window.ethereum && window.ethereum.isMetaMask)

    static chains = String(Config.env.CHAINS)
        .split(',')
        .map((chain) => Number(chain))

    static networks: { [chainId: number]: BasicChainInformation } = {
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
            name: 'Smart Chain - Testnet',
            nativeCurrency: {
                name: 'Binance Coin',
                symbol: 'BNB',
                decimals: 18,
            },
            blockExplorerUrls: ['https://testnet.bscscan.com'],
        },
        56: {
            urls: ['https://bsc-dataseed.binance.org'],
            name: 'mainnet',
            nativeCurrency: {
                name: 'Binance Coin',
                symbol: 'BNB',
                decimals: 18,
            },
            blockExplorerUrls: ['https://bscscan.com'],
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

    static logout = () => {
        sessionStorage.removeItem('PUBLIC_ADDRESS')
        sessionStorage.removeItem('PUBLIC_TOKEN')
        sessionStorage.removeItem('PUBLIC_WALLET')
    }

    static MODAL_REGISTER_EMAIL = 'registerEmail'

    static MODAL_UPDATE_EMAIL = 'updateEmail'

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
        // { menuId: 'commission_policy', router: '/buy-covered', name: 'common:header:commission_policy', parentId: 0 },
    ]

    static subMenu = [
        {
            menuId: 'recent-transaction',
            // router: '/insurance-history',
            name: 'common:header:recent_transactions',
            parentId: 'account-info',
            // icon: '/images/icons/ic_recent_transaction.png',
            icon: HistoryIcon,
            isIconSvg: true,
        },
        {
            menuId: 'my-covered-contract',
            router: '/insurance-history',
            name: 'common:header:my_covered_contract',
            parentId: 'account-info',
            // icon: '/images/icons/ic_user.png',
            icon: UserIcon,
            isIconSvg: true,
        },
        {
            menuId: Config.MODAL_UPDATE_EMAIL,
            name: 'common:header:update_my_email',
            parentId: 'account-info',
            // icon: '/images/icons/ic_email.png',
            icon: EmailIcon,
            isIconSvg: true,
        },
        {
            menuId: 'disconnect',
            name: 'common:header:disconnect',
            parentId: 'account-info',
            // icon: '/images/icons/ic_bx-log-out.png',
            icon: DisconnectIcon,
            isIconSvg: true,
        },
    ]

    static landingPageMenu = [
        {
            menuId: 'buy_covered',
            // router: '/buy-covered',
            name: 'home:landing:white_paper',
            parentId: 0,
            href_en: 'https://quocdat.gitbook.io/whitepaper-insurance-en/',
            href_vi: 'https://quocdat.gitbook.io/whitepaper-insurance/',
        },
        {
            menuId: 'faq_section',
            // router: '#faq-section',
            name: 'home:landing:faq_title',
            parentId: 0,
            section: 'faq-section',
        },
        {
            menuId: 'modal_contact',
            name: 'home:landing:contact',
            parentId: 0,
        },
    ]

    static copy = (text: string) => {
        navigator.clipboard.writeText(text)
    }
}

export default Config
