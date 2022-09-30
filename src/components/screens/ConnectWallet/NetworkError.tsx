import Button from 'components/common/Button/Button'
import { CopyIcon } from 'components/common/Svg/SvgIcon'
import { useTranslation } from 'next-i18next'
import React from 'react'

const NetworkError = () => {
    const { t } = useTranslation()

    const onAddNetwork = () => {
        window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#settings/networks/add-network', '_blank')
    }

    const onCopy = (text: string) => {
        if (navigator) navigator?.clipboard?.writeText(text)
    }

    return (
        <div className="flex flex-col justitfy-center items-center text-center w-full">
            <div className="w-20 h-20 sm:w-[7.75rem] sm:h-[7.75rem]">
                <img src="/images/icons/ic_failed.png" />
            </div>
            <div className="text-xl mt-6 font-medium">{t('common:not_found_network:title')}</div>
            <div className="text-txtSecondary mt-2 text-center px-10">{t('common:not_found_network:description')}:</div>
            <div className="h-[1px] w-full bg-divider mt-6 mb-4" />
            <div className="flex flex-col w-full space-y-2">
                <div className="flex items-center justify-between">
                    <div className="text-txtSecondary">{t('common:not_found_network:network_name')}</div>
                    <div onClick={() => onCopy('Binance Smart Chain')} className="font-semibold">
                        Binance Smart Chain
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-txtSecondary whitespace-nowrap">{t('common:not_found_network:new_rpc_url')}</div>
                    <div onClick={() => onCopy('https://bsc-dataseed.binance.org/')} className="font-semibold flex items-center text-right space-x-1">
                        <span>https://bsc-dataseed.binance.org/</span>
                        <span>
                            <CopyIcon size={18} />
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-txtSecondary">{t('common:not_found_network:chainID')}</div>
                    <div onClick={() => onCopy('56')} className="font-semibold">
                        56
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-txtSecondary">{t('common:not_found_network:symbol')}</div>
                    <div onClick={() => onCopy('BNB')} className="font-semibold">
                        BNB
                    </div>
                </div>
            </div>
            <Button onClick={onAddNetwork} variants="primary" className="w-full py-2 mt-8">
                {t('common:not_found_network:add_bnb')}
            </Button>
        </div>
    )
}

export default NetworkError
