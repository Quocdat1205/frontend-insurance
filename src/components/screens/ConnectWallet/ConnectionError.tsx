import { ReplayIcon } from 'components/common/Svg/SvgIcon'
import { useTranslation } from 'next-i18next'
import React from 'react'

interface ConnectionError {
    message: string
    onReconnect: () => void
}
const ConnectionError = ({ message, onReconnect }: ConnectionError) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col justitfy-center items-center text-center w-full">
            <div className="w-[7.75rem] h-[7.75rem]">
                <img src="/images/icons/ic_failed.png" />
            </div>
            <div className="text-xl mt-6 font-medium">{t('common:connection_error')}</div>
            <div className="text-txtSecondary mt-2 text-center">{t('common:reason_error', { reason: message })}</div>
            <div onClick={onReconnect} className="mt-8 font-semibold text-red flex items-center space-x-2 cursor-pointer">
                <ReplayIcon />
                <span>{t('common:reconnect')}</span>
            </div>
        </div>
    )
}

export default ConnectionError
