import React from 'react'
import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import { wallets } from 'components/web3/Web3Types'

interface InstallerWallet {
    wallet: string | undefined
}

const InstallerWallet = ({ wallet }: InstallerWallet) => {
    const { t } = useTranslation()

    const onInstall = () => {
        if (isMetamask) window.open('https://metamask.io/download', '_blank')
    }

    const onRead = (e: any) => {
        let el = e?.target
        while (el && el !== e.currentTarget && el.tagName !== 'SPAN') {
            el = el.parentNode
        }
        if (el && el.tagName === 'SPAN') {
            if (isMetamask) {
                window.open('https://quocdat.gitbook.io/whitepaper-insurance/bo-huong-dan/huong-dan-su-dung-vi')
            }
        }
    }

    const isMetamask = wallets.metaMask === wallet

    return (
        <div className="flex flex-col justitfy-center items-center text-center w-full">
            <div className="w-20 h-20 sm:w-[7.75rem] sm:h-[7.75rem]">
                <img src="/images/icons/ic_metamask.png" />
            </div>
            <div className="text-xl mt-6 font-medium">{t(`common:installer:${isMetamask ? 'metamask' : 'coinbase'}_title`)}</div>
            <div className="text-txtSecondary mt-2 text-center text-sm sm:text-base">
                {t(`common:installer:${isMetamask ? 'metamask' : 'coinbase'}_content`)}
            </div>
            <Button onClick={onInstall} variants="primary" className="w-full py-2 mt-8 text-sm sm:text-base">
                {t('common:installer:install')}
            </Button>
            <div
                onClick={onRead}
                className="mt-4 text-txtSecondary text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: t(`common:installer:${isMetamask ? 'metamask' : 'coinbase'}_guide`) }}
            />
        </div>
    )
}

export default InstallerWallet
