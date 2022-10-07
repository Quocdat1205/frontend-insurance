import { StateInsurance } from 'types/types'

export const PORTAL_MODAL_ID: string = 'PORTAL_MODAL'

export const screens = {
    drawer: 819,
    drawerHome: 1280,
}

const SUPPORT = {
    DEFAULT: '/',
}
export const PATHS = {
    SUPPORT,

    // Add news path here
}

export const stateInsurance: StateInsurance = {
    AVAILABLE: 'Available',
    REFUNDED: 'Refunded',
    CLAIM_WAITING: 'Claim_waiting',
    CLAIMED: 'Claimed',
    EXPIRED: 'Expired',
    LIQUIDATED: 'Liquidated',
}

export const months: any = [
    {
        en: 'January',
        vi: 'Tháng 1',
    },
    {
        en: 'February',
        vi: 'Tháng 2',
    },
    {
        en: 'March',
        vi: 'Tháng 3',
    },
    {
        en: 'April',
        vi: 'Tháng 4',
    },
    {
        en: 'May',
        vi: 'Tháng 5',
    },
    {
        en: 'June',
        vi: 'Tháng 6',
    },
    {
        en: 'July',
        vi: 'Tháng 7',
    },
    {
        en: 'August',
        vi: 'Tháng 8',
    },
    {
        en: 'September',
        vi: 'Tháng 9',
    },
    {
        en: 'October',
        vi: 'Tháng 10',
    },
    {
        en: 'November',
        vi: 'Tháng 11',
    },
    {
        en: 'December',
        vi: 'Tháng 12',
    },
]

export const days: any = [
    {
        en: 'SUN',
        vi: 'CN',
    },
    {
        en: 'MON',
        vi: 'T2',
    },
    {
        en: 'TUE',
        vi: 'T3',
    },
    {
        en: 'WED',
        vi: 'T4',
    },
    {
        en: 'THU',
        vi: 'T5',
    },
    {
        en: 'FRI',
        vi: 'T6',
    },
    {
        en: 'SAT',
        vi: 'T7',
    },
]

export const DURATION_AOS = 400

export const errorsWallet = {
    Already_opened: 32002,
    Cancel: 4001,
    Not_found: 4902,
    Success: 1013,
    NetWork_error: 'ERR_NETWORK',
    Connect_failed: 'CONNECT_FAILED',
}

export const seoConfigs: any[] = [
    {
        url: '/insurance-history.*',
        en: {
            url: '/insurance-history',
            title: 'Change risk to payback | Cover Value for BTC, ETH, BNB and Altcoin',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Change risk to payback | Cover Value for BTC, ETH, BNB and Altcoin',
        },
        vi: {
            url: '/insurance-history',
            title: 'Biến rủi ro thành lợi nhuận | Bảo chứng tài sản tiền số BTC, ETH, BNB và Altcoin',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Biến rủi ro thành lợi nhuận | Bảo chứng tài sản tiền số BTC, ETH, BNB và Altcoin',
        },
    },
    {
        url: '/buy-covered.*',
        en: {
            url: '/buy-covered',
            title: 'BTC/USDT: 30,000 | Nami Insurance',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'BTC/USDT: 30,000 | Nami Insurance',
        },
        vi: {
            url: '/buy-covered',
            title: 'Giá tương ứng với Tài sản BTC/USDT: 30,000 | Nami Insurance',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Giá tương ứng với Tài sản BTC/USDT: 30,000 | Nami Insurance',
        },
    },
    {
        url: '/home.*',
        en: {
            url: '/home',
            title: 'Change risk to payback | Cover Value for BTC, ETH, BNB and Altcoins',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Change risk to payback | Cover Value for BTC, ETH, BNB and Altcoins',
        },
        vi: {
            url: '/home',
            title: 'Biến rủi ro thành lợi nhuận | Bảo chứng tài sản tiền số BTC, ETH, BNB và Altcoins',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Biến rủi ro thành lợi nhuận | Bảo chứng tài sản tiền số BTC, ETH, BNB và Altcoins',
        },
    },
    {
        url: '.*',
        en: {
            title: 'Nami Insurance | The first Blockchain-based insurance protocol for asset value',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Nami Insurance | The first Blockchain-based insurance protocol for asset value',
        },
        vi: {
            title: 'Nami Insurance | Giao thức bảo hiểm giá trị tài sản đầu tiên ứng dụng công nghệ Blockchain',
            description: 'Cover your crypto asset value with 0 fee',
            keywords: 'Nami Insurance | Giao thức bảo hiểm giá trị tài sản đầu tiên ứng dụng công nghệ Blockchain',
        },
    },
]
