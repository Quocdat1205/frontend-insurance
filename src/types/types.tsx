export interface Action {
    type: string
    payload: any
}

export interface OptionNotify {
    ariaProps?: string
    position?: string | number
    duration?: number
    className?: string
    id?: string | number
    button?: any
}
export interface Toast {
    show: (type: string, messages: string, option?: OptionNotify) => void
}

export interface ConnectWalletType {
    show: () => void
}

export interface IconSvg {
    size?: number
    color?: string
    className?: string
    onClick?: () => void
}

export interface StateInsurance {
    AVAILABLE?: string
    REFUNDED?: string
    CLAIM_WAITING?: string
    CLAIMED?: string
    EXPIRED?: string
    LIQUIDATED?: string
}

export interface UnitConfig {
    assetCode: string
    assetDigit: number
    assetName: string
    id: number | string
    [key: string]: number | string
}

export interface PairConfig {
    baseAsset: string
    filters: any
    quoteAsset: string
    symbol: string
    [key: string]: number | string
}

export interface CountdownType {
    date: Date
}
