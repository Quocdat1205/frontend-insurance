import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { X } from 'react-feather'
import Button from 'components/common/Button/Button'
import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import Menu from 'components/common/Menu/Menu'
import { MenuIcon, RightArrow } from 'components/common/Svg/SvgIcon'
import Drawer from 'components/layout/Drawer'
import ContactModal from 'components/screens/HomePage/ContactModal'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { RootStore, useAppSelector } from 'redux/store'

const HeaderLanding = () => {
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width < 1024
    const [visible, setVisible] = useState(false)
    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const [isShowContactModal, setIsShowContactModal] = useState(false)

    const scrollTo = (id: string) => {
        const elId = id.split('#')[1]
        const section = document.querySelector(`${elId}`)
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleCloseContactModal = useCallback(() => {
        setIsShowContactModal(false)
    }, [])

    const onChangeMenu = (e: any) => {
        // Redirect link
        if (e?.[`href_${language}`]) {
            window.open(e[`href_${language}`])
            return
        }

        handleOnClickMenuItem(e)

        if (isMobile && e?.children.length > 0) return
        if (e?.menuId && e.router) router.push(e.router)
        if (isMobile) setVisible(false)
    }

    const handleOnClickMenuItem = (item: any) => {
        switch (item?.menuId) {
            case 'modal_contact':
                setIsShowContactModal(true)
                break
            default:
                break
        }
    }

    return (
        <header className="header-landing h-[4rem] mb:h-[4.25rem] flex items-center px-4 mb:px-10 border-b border-divider sticky top-0 bg-white z-[10]">
            <div className="flex items-center justify-between w-full m-auto space-x-4 max-w-screen-layout 4xl:max-w-screen-4xl sm:space-x-12">
                <div className={'flex items-center w-full'}>
                    <div className="w-[75px]">
                        <img src="/images/ic_logo.png" />
                    </div>
                    {!isMobile && !loading_account && (
                        <div className="flex items-center justify-end w-full py-3 text-sm font-semibold mb:py-0">
                            <Menu data={Config.landingPageMenu} onChange={onChangeMenu} />
                        </div>
                    )}
                </div>
                {/* Modal */}
                <ContactModal visible={isShowContactModal} onClose={handleCloseContactModal} />

                {!loading_account && (
                    <div className="flex items-center py-3 space-x-4 !ml-6 text-sm font-semibold mb:py-0">
                        {!isMobile ? (
                            <>
                                <ButtonLanguage />
                                <Button onClick={() => router.push('/home')} className="min-w-[9.5rem] px-6 py-2 flex items-center space-x-2 w-max">
                                    <span>{t('home:landing:access')}</span>
                                    <RightArrow />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => router.push('/home')} className="px-4 py-2 leading-[1rem] flex items-center space-x-2 w-max">
                                    <span className="font-semibold">{t('home:landing:access')}</span>
                                    <RightArrow />
                                </Button>
                                <div className="cursor-pointer" onClick={() => setVisible(!visible)}>
                                    {visible ? <X /> : <MenuIcon />}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            {isMobile && (
                <Drawer visible={visible} onClose={() => setVisible(false)}>
                    <div>
                        <div className="mb-8">
                            <Menu data={Config.landingPageMenu} onChange={onChangeMenu} />
                        </div>
                        <div className="mx-4">
                            <Button
                                onClick={() => router.push('/home')}
                                className="py-[0.875rem] leading-5 flex items-center justify-center space-x-2 w-full min-w-[12.75rem]"
                            >
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
