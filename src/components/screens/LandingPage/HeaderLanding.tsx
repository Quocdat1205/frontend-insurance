import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import { MenuIcon, RightArrow } from 'components/common/Svg/SvgIcon'
import React, { useState } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import Drawer from 'components/layout/Drawer'
import { useRouter } from 'next/router'
import Button from 'components/common/Button/Button'
import Menu from 'components/common/Menu/Menu'
import { X } from 'react-feather'

const HeaderLanding = () => {
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width < 820
    const [visible, setVisible] = useState(false)
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const menu = [
        { menuId: 'white-paper', router: 'white-paper', name: 'home:landing:white_paper', parentId: 0 },
        { menuId: 'faq', router: 'faq', name: 'home:landing:faq', parentId: 0 },
        { menuId: 'contact', router: 'contact', name: 'home:landing:contact', parentId: 0 },
    ]

    return (
        <header className="header-landing px-4 mb:px-10 border-b border-divider sticky top-0 bg-white z-[10]">
            <div className="max-w-screen-layout m-auto flex items-center justify-between">
                <div className="w-[75px]">
                    <img src="/images/ic_logo.png" />
                </div>
                <div className="flex items-center space-x-6 py-3 mb:py-0 text-sm font-semibold">
                    {!isMobile ? (
                        <>
                            <Menu data={menu} />
                            <ButtonLanguage />
                            <Button onClick={() => router.push('/home')} className="px-6 py-2 flex items-center space-x-2">
                                <span>{t('home:landing:access')}</span>
                                <RightArrow />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => router.push('/home')} className="px-4 py-2 leading-[1rem] flex items-center space-x-2">
                                <span className="font-semibold">{t('home:landing:access')}</span>
                                <RightArrow />
                            </Button>
                            <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
                                {visible ? <X /> : <MenuIcon />}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isMobile && (
                <Drawer visible={visible} onClose={() => setVisible(false)}>
                    <div className="w-full">
                        <div className="mb-8">
                            <Menu data={menu} />
                        </div>
                        <div className="mx-4">
                            <Button onClick={() => router.push('/home')} className="py-[0.875rem] leading-5 flex items-center justify-center space-x-2 w-full">
                                <span className="">{t('home:landing:access')}</span>
                                <RightArrow />
                            </Button>
                        </div>
                    </div>
                    <ButtonLanguage className="mx-4" mobile />
                </Drawer>
            )}
        </header>
    )
}

export default HeaderLanding
