import Button from 'components/common/Button/Button'
import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import Menu from 'components/common/Menu/Menu'
import { MenuIcon } from 'components/common/Svg/SvgIcon'
import Drawer from 'components/layout/Drawer'
import { ChainDataList } from 'components/web3/constants/chains'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import { screens } from 'utils/constants'
import { X } from 'react-feather'
import Notifications from 'components/layout/Notifications'
import { useRouter } from 'next/router'
import { RootStore, useAppSelector } from 'redux/store'
import detectEthereumProvider from '@metamask/detect-provider'
import { isMobile } from 'react-device-detect'

const Header = () => {
    const { t } = useTranslation()
    const { account, chain } = useWeb3Wallet()
    const { width } = useWindowSize()
    const router = useRouter()
    const isMobile = width && width < screens.drawer
    const [visible, setVisible] = useState<boolean>(false)
    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)

    const onConnect = async () => {
        const provider = await detectEthereumProvider({ timeout: 0 })
        if (isMobile) {
            window.open(`https://metamask.app.link/dapp/${Config.env.APP_URL}`)
        } else {
            provider ? Config.connectWallet() : Config.toast.show('error', 'Cài đặt metamask')
        }
    }

    const network = useMemo(() => {
        return ChainDataList[chain?.id]
    }, [account, chain])

    const onChangeMenu = (e: any) => {
        if (isMobile && e?.children.length > 0) return
        if (e.router) router.push(e.router)
    }

    return (
        <header className="header-landing h-[4rem] sm:h-[4.25rem] flex items-center px-4 mb:px-10 border-b border-divider sticky top-0 bg-white z-[50]">
            <div className="max-w-screen-layout 4xl:max-w-screen-4xl m-auto w-full flex items-center justify-between space-x-4 sm:space-x-12">
                <div className="min-w-[67px] w-[75px]">
                    <img src="/images/ic_logo.png" />
                </div>
                <div className="w-full flex items-center justify-end mb:justify-between  py-3 mb:py-0 text-sm font-semibold">
                    {!isMobile && (
                        <div className="hidden mb:block">
                            <Menu data={Config.homeMenu} onChange={onChangeMenu} />
                        </div>
                    )}
                    {!loading_account && (
                        <div className="flex items-center space-x-5 sm:space-x-6 cursor-pointer">
                            {network && !isMobile && <Notifications />}
                            {account && network && (
                                <div className="p-1 bg-hover rounded-[5px] flex items-center space-x-2">
                                    <img src={network.icon} width={24} height={24} />
                                    <div>{network.chain}</div>
                                    <div className="rounded-[5px] bg-white overflow-hidden px-2 sm:px-4 py-1">
                                        {account.substr(0, isMobile ? 2 : 4) + '...' + account.substr(-4)}
                                    </div>
                                </div>
                            )}
                            {network && isMobile && <Notifications />}
                            {!isMobile && <ButtonLanguage />}
                            {!account && (
                                <Button onClick={onConnect} className="font-semibold px-4 py-2 space-x-2">
                                    {t('home:home:connect_wallet')}
                                </Button>
                            )}
                            {isMobile && (
                                <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
                                    {visible ? <X /> : <MenuIcon />}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {isMobile && (
                <Drawer visible={visible} onClose={() => setVisible(false)}>
                    <div>
                        <div className="mb-8">
                            <Menu data={Config.homeMenu} onChange={onChangeMenu} />
                        </div>
                        {!network && (
                            <div className="mx-4">
                                <Button onClick={onConnect} className="w-full font-semibold py-[0.875rem] leading-5 space-x-2">
                                    {t('home:home:connect_wallet')}
                                </Button>
                            </div>
                        )}
                    </div>
                    <ButtonLanguage className="mx-4" mobile />
                </Drawer>
            )}
        </header>
    )
}

export default Header
