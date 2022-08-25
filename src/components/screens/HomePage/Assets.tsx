import Button from 'components/common/Button/Button'
import CardShadow from 'components/common/Card/CardShadow'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Assets = () => {
    const { t } = useTranslation()
    const { account } = useWeb3Wallet()

    const onConnectWallet = () => {
        Config.connectWallet()
    }

    const onBuy = (key: string) => {
        if (!account) {
            Config.toast.show('error', t('common:please_connect_your_wallet'), {
                button: (
                    <button className="text-sm font-semibold underline" onClick={onConnectWallet}>
                        {t('common:connect_now')}
                    </button>
                ),
            })
        }
    }

    return (
        <div className="grid grid-rows-3 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-6">
            <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                <div className="flex items-center space-x-3">
                    <img width="36" height="36" src="/images/icons/ic_bitcoin.png" />
                    <span className="font-semibold text-xl sm:text-2xl">Bitcoin</span>
                </div>
                <Button onClick={() => onBuy('bitcoin')} variants="outlined" className="py-3">
                    {t('home:landing:buy_covered')}
                </Button>
            </CardShadow>
            <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                <div className="flex items-center space-x-3">
                    <img width="36" height="36" src="/images/icons/ic_ethereum.png" />
                    <span className="font-semibold text-xl sm:text-2xl">Ethereum</span>
                </div>
                <Button onClick={() => onBuy('ethereum')} variants="outlined" className="py-3">
                    {t('home:landing:buy_covered')}
                </Button>
            </CardShadow>
            <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                <div className="flex items-center space-x-3">
                    <img width="36" height="36" src="/images/icons/ic_binance.png" />
                    <span className="font-semibold text-xl sm:text-2xl">Binance Coin</span>
                </div>
                <Button onClick={() => onBuy('binance')} variants="outlined" className="py-3">
                    {t('home:landing:buy_covered')}
                </Button>
            </CardShadow>
        </div>
    )
}

export default Assets
