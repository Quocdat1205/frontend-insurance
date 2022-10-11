import React, { useMemo } from 'react'
import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import { wallets } from 'components/web3/Web3Types'

interface InstallerWallet {
    wallet: string | undefined
}

const InstallerWallet = ({ wallet }: InstallerWallet) => {
    const { t } = useTranslation()

    const info = useMemo(() => {
        let data = { url: '', icon: '', title: '', content: '', install: '', guide: '' }
        switch (wallet) {
            case wallets.metaMask:
                data = {
                    url: 'https://metamask.io/download',
                    icon: '/images/icons/ic_metamask.png',
                    title: t(`common:installer:metamask_title`),
                    content: t(`common:installer:metamask_content`),
                    install: t('common:installer:install'),
                    guide: t(`common:installer:metamask_guide`),
                }
                break
            case wallets.coinbaseWallet:
                data = {
                    url: 'https://www.coinbase.com/wallet',
                    icon: '/images/icons/ic_coinbase.png',
                    title: t(`common:installer:coinbase_title`),
                    content: t(`common:installer:coinbase_content`),
                    install: t('common:installer:install'),
                    guide: t(`common:installer:coinbase_guide`),
                }
                break
            default:
                break
        }
        return data
    }, [wallet])

    const onInstall = () => {
        window.open(info.url, '_blank')
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
                <img src={info.icon} />
            </div>
            <div className="text-xl mt-6 font-medium">{info.title}</div>
            <div className="text-txtSecondary mt-2 text-center text-sm sm:text-base">{info.content}</div>
            <Button onClick={onInstall} variants="primary" className="w-full py-2 mt-8 text-sm sm:text-base">
                {info.install}
            </Button>
            <div onClick={onRead} className="mt-4 text-txtSecondary text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: info.guide }} />
        </div>
    )
}

export default InstallerWallet
