import { ReplayIcon } from 'components/common/Svg/SvgIcon'
import { useTranslation } from 'next-i18next'
import React from 'react'

interface ConnectionError {
    message: string
    onReconnect: () => void
    isReload: boolean
    textErrorButton?: string
    showIcon?: boolean
}
const ConnectionError = ({ message, onReconnect, isReload, textErrorButton, showIcon = true }: ConnectionError) => {
    const { t } = useTranslation()

    const _onReconnect = () => {
        if (isReload) {
            window.location.reload()
            return
        }
        onReconnect()
    }

    return (
        <div className="flex flex-col justitfy-center items-center text-center w-full">
            <div className="w-20 h-20 sm:w-[7.75rem] sm:h-[7.75rem]">
                <img src="/images/icons/ic_failed.png" />
            </div>
            <div className="text-xl mt-6 font-medium">{t('common:connection_error')}</div>
            <div className="text-txtSecondary mt-2 text-center text-sm sm:text-base">{t('common:reason_error', { reason: message })}</div>
            <div onClick={_onReconnect} className="mt-8 text-sm sm:text-base font-semibold text-red flex items-center space-x-2 cursor-pointer">
                {showIcon && <ReplayIcon />}
                <span>{textErrorButton}</span>
            </div>
        </div>
    )
}

export default ConnectionError
