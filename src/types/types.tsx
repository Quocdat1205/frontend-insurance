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

export interface IconSvg {
    size?: number
    color?: string
}

export interface StateInsurance {
    AVAILABLE?: string
    REFUNDED?: string
    CLAIM_WAITING?: string
    CLAIMED?: string
    EXPIRED?: string
    LIQUIDATED?: string
}
