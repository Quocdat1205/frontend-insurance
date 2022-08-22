import Button from 'components/common/Button/Button'
import CardShadow from 'components/common/Card/CardShadow'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Assets = () => {
    const { t } = useTranslation()
    return (
        <section className="pt-20 sm:pt-[7.5rem] px-4 max-w-screen-insurance m-auto">
            <div className="text-2xl font-semibold mb-6">{t('home:home:new_insurance_assets')}</div>
            <div className="grid grid-rows-3 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-6">
                <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                    <div className="flex items-center space-x-3">
                        <img width="36" height="36" src="/images/icons/ic_bitcoin.png" />
                        <span className="font-semibold text-xl">Bitcoin</span>
                    </div>
                    <Button variants="outlined" className="py-3">
                        {t('home:landing:buy_covered')}
                    </Button>
                </CardShadow>
                <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                    <div className="flex items-center space-x-3">
                        <img width="36" height="36" src="/images/icons/ic_ethereum.png" />
                        <span className="font-semibold text-xl">Ethereum</span>
                    </div>
                    <Button variants="outlined" className="py-3">
                        {t('home:landing:buy_covered')}
                    </Button>
                </CardShadow>
                <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                    <div className="flex items-center space-x-3">
                        <img width="36" height="36" src="/images/icons/ic_binance.png" />
                        <span className="font-semibold text-xl">Binance Coin</span>
                    </div>
                    <Button variants="outlined" className="py-3">
                        {t('home:landing:buy_covered')}
                    </Button>
                </CardShadow>
            </div>
        </section>
    )
}

export default Assets
