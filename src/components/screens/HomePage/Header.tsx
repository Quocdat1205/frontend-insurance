import Button from 'components/common/Button/Button'
import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import Menu from 'components/common/Menu/Menu'
import { MenuIcon } from 'components/common/Svg/SvgIcon'
import Drawer from 'components/layout/Drawer'
import { Chains } from 'components/web3/constants/chains'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import { screens } from 'utils/constants'
import { X } from 'react-feather'
import Notifications from 'components/layout/Notifications'
import { RootStore } from 'redux/store'
import { useSelector } from 'react-redux'

const Header = () => {
    const { t } = useTranslation()
    const { account, chain } = useWeb3Wallet()
    const { width } = useWindowSize()
    const profile = useSelector((state: RootStore) => state.setting.profile)

    const isMobile = width && width < screens.drawer
    const menu = [
        { menuId: 'home', router: 'home', name: t('home:landing:home'), parentId: 0 },
        { menuId: 'insurance', router: 'insurance', name: t('home:landing:buy_covered'), parentId: 0 },
        {
            menuId: 'buy-covered',
            router: 'buy-covered',
            name: t('home:landing:buy_covered'),
            parentId: 'insurance',
            icon: '/images/icons/ic_menu_buy_covered.png',
        },
        {
            menuId: 'insurance-history',
            router: 'insurance-history',
            name: t('home:home:insurance_history'),
            parentId: 'insurance',
            icon: '/images/icons/Ic_menu_users.png',
        },
    ]

    const [visible, setVisible] = useState(false)

    const onConnect = () => {
        Config.connectWallet()
    }

    const network = useMemo(() => {
        return Chains[chain?.id]
    }, [account, chain])

    return (
        <header className="header-landing px-4 mb:px-10 border-b border-divider sticky top-0 bg-white z-[10]">
            <div className="max-w-screen-layout m-auto flex items-center justify-between space-x-12">
                <div className="w-[75px]">
                    <img src="/images/ic_logo.png" />
                </div>
                <div className="w-full flex items-center justify-end mb:justify-between  py-3 mb:py-0 text-sm font-semibold">
                    {!isMobile && <Menu data={menu} />}
                    <div className="flex items-center space-x-6 cursor-pointer">
                        {network && <Notifications />}
                        {account && network && (
                            <div className="p-1 bg-hover rounded-[5px] flex items-center space-x-2">
                                <img src={network.icon} width={24} height={24} />
                                <div>{network.chain}</div>
                                <div className="rounded-[5px] bg-white  px-4 py-1">{account.substr(0, 4) + '...' + account.substr(-4)}</div>
                            </div>
                        )}
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
                </div>
            </div>
            {isMobile && (
                <Drawer visible={visible} onClose={() => setVisible(false)}>
                    <div>
                        <div className="mb-8">
                            <Menu data={menu} />
                        </div>
                        <div className="mx-4">
                            <Button onClick={onConnect} className="w-full font-semibold py-[0.875rem] leading-5 space-x-2">
                                {t('home:home:connect_wallet')}
                            </Button>
                        </div>
                    </div>
                    <ButtonLanguage className="mx-4" mobile />
                </Drawer>
            )}
        </header>
    )
}

export default Header
