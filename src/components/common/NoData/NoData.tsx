import React from 'react'
import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'

interface NoData {
    onClick?: () => void
    textContent: string
    textButton?: string
    img?: string
    className?: string
    showButton?: boolean
}

const NoData = ({ textContent, textButton, onClick, img, className = '', showButton = true }: NoData) => {
    const { t } = useTranslation()

    return (
        <div className={`w-full flex flex-col items-center justify-center sm:min-h-[240px] ${className}`}>
            <div className="sm:min-h-[240px]">
                <img className="max-w-[230px] sm:max-w-[310px]" src={img ?? '/images/icons/notice_noData.png'} />
            </div>
            <div className="mb-8 text-sm">{textContent}</div>
            {showButton && (
                <Button onClick={onClick} className="py-3 px-6 sm:px-20 sm:font-semibold rounded-xl text-sm sm:text-base">
                    {textButton ?? t('home:home:connect_wallet')}
                </Button>
            )}
        </div>
    )
}

export default NoData
