import { BasicChainInformation, ExtendedChainInformation, wallets } from 'components/web3/Web3Types'
import env from 'config/env'
import { Toast } from 'types/types'
import { DisconnectIcon, EmailIcon, HistoryIcon, UserIcon } from 'components/common/Svg/SvgIcon';

class Config {
    static env = env

    static client = typeof window !== 'undefined'

    static toast: Toast

    static alert: Toast

    static web3: any

    static connectWallet = (wallet: string = wallets.metaMask) => {
        if (Config) {
            Config.web3.activate(wallet)
        }
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
        { menuId: 'commission_policy', router: '/buy-covered', name: 'common:header:commission_policy', parentId: 0 },
        // {
        //     menuId: 'buy-covered',
        //     router: '/buy-covered',
        //     name: 'common:header:buy_covered',
        //     // parentId: 'buy-covered-parent',
        //     // icon: '/images/icons/ic_menu_buy_covered.png',
        //     isMobile: true,
        // },
        // {
        //     menuId: 'insurance-history',
        //     router: '/buy-covered/insurance-history',
        //     name: 'common:header:insurance_history',
        //     // parentId: 'buy-covered-parent',
        //     // icon: '/images/icons/Ic_menu_users.png',
        //     isMobile: true,
        // },
    ]

    static subMenuMobile  = [
        {
            menuId: 'recent-transaction',
            router: '/buy-covered',
            name: 'common:header:recent_transactions',
            parentId: 'account-info',
            // icon: '/images/icons/ic_recent_transaction.png',
            icon: HistoryIcon,
            isMobile: true,
            isIconSvg: true,
        },
        {
            menuId: 'my-covered-contract',
            router: '/buy-covered',
            name: 'common:header:my_covered_contract',
            parentId: 'account-info',
            // icon: '/images/icons/ic_user.png',
            isMobile: true,
            icon: UserIcon,
            isIconSvg: true,
        },
        {
            menuId: 'update-email',
            router: '/buy-covered',
            name: 'common:header:update_my_email',
            parentId: 'account-info',
            modalName: 'updateEmail',
            // icon: '/images/icons/ic_email.png',
            isMobile: true,
            icon: EmailIcon,
            isIconSvg: true,
        },
        {
            menuId: 'disconnect',
            router: '/buy-covered',
            name: 'common:header:disconnect',
            parentId: 'account-info',
            // icon: '/images/icons/ic_bx-log-out.png',
            isMobile: true,
            icon: DisconnectIcon,
            isIconSvg: true,
        },
    ]

    static subMenu  = [
        {
            menuId: 'recent-transaction',
            router: '/home',
            name: 'common:header:recent_transactions',
            parentId: 'account-info',
            // icon: '/images/icons/ic_recent_transaction.png',
            icon: HistoryIcon,
            isIconSvg: true,
        },
        {
            menuId: 'my-covered-contract',
            router: '/home',
            name: 'common:header:my_covered_contract',
            parentId: 'account-info',
            // icon: '/images/icons/ic_user.png',
            icon: UserIcon,
            isIconSvg: true,
        },
        {
            menuId: 'update-email',
            router: '/buy-covered',
            name: 'common:header:update_my_email',
            parentId: 'account-info',
            modalName: 'updateEmail',
            // icon: '/images/icons/ic_email.png',
            icon: EmailIcon,
            isIconSvg: true,
        },
        {
            menuId: 'disconnect',
            router: '/buy-covered',
            name: 'common:header:disconnect',
            parentId: 'account-info',
            // icon: '/images/icons/ic_bx-log-out.png',
            icon: DisconnectIcon,
            isIconSvg: true,
        },
    ]

    static homeMenuMobile = [
        { menuId: 'account-info', router: '/home', name: 'common:header:account_info_title', parentId: 0 },
        ...Config.subMenuMobile,
        ...Config.homeMenu
    ]
}

export default Config
