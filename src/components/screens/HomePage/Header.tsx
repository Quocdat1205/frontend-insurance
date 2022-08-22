import Button from 'components/common/Button/Button'
import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import Menu from 'components/common/Menu/Menu'
import { MenuIcon } from 'components/common/Svg/SvgIcon'
import Drawer from 'components/layout/Drawer'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { screens } from 'utils/constants'

const Header = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const menu = [
        { menuId: 'home', router: 'home', name: t('home:landing:home'), parentId: 0 },
        { menuId: 'insurance', router: 'insurance', name: t('home:landing:buy_covered'), parentId: 0 },
        { menuId: 'history-insurance', router: 'history-insurance', name: 'Lịch sử bảo hiểm', parentId: 'insurance' },
    ]

    const [visible, setVisible] = useState(false)
    return (
        <header className="header-landing px-4 mb:px-10 border-b border-divider sticky top-0 bg-white z-[10]">
            <div className="max-w-screen-layout m-auto flex items-center justify-between space-x-12">
                <div className="w-[75px]">
                    <img src="/images/ic_logo.png" />
                </div>
                <div className="w-full flex items-center justify-end mb:justify-between  py-3 mb:py-0 text-sm font-semibold">
                    {!isMobile && <Menu data={menu} />}
                    <div className="flex items-center space-x-6">
                        {!isMobile && <ButtonLanguage />}
                        <Button className="font-semibold px-4 py-2 leading-[1rem] space-x-2">{t('home:home:connect_wallet')}</Button>
                        {isMobile && (
                            <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
                                <MenuIcon />
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
                            <Button className="w-full font-semibold py-[0.875rem] leading-5 space-x-2">{t('home:home:connect_wallet')}</Button>
                        </div>
                    </div>
                    <ButtonLanguage className="mx-4" mobile />
                </Drawer>
            )}
        </header>
    )
}

export default Header
