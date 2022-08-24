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
