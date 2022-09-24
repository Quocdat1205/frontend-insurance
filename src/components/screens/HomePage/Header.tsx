import { createNullLogger } from '@algolia/logger-common'
import detectEthereumProvider from '@metamask/detect-provider'
import acorn from 'acorn'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { ChevronDown, ChevronUp, X } from 'react-feather'
import { useFilters } from 'react-table'
import Button from 'components/common/Button/Button'
import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import Menu from 'components/common/Menu/Menu'
import { MenuIcon } from 'components/common/Svg/SvgIcon'
import Drawer from 'components/layout/Drawer'
import Notifications from 'components/layout/Notifications'
import EmailSubscriptionModal from 'components/screens/HomePage/EmailSubModal'
import UpdateEmailSubscriptionModal from 'components/screens/HomePage/EmailSubUpdateModal'
import { ChainDataList } from 'components/web3/constants/chains'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import useWindowSize from 'hooks/useWindowSize'
import { RootStore, useAppSelector } from 'redux/store'
import { API_GET_INFO_USER } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { screens } from 'utils/constants'
import { getModalSubscribeStorage, setModalSubscribeStorage } from 'utils/utils'

const Header = () => {
    const { t } = useTranslation()
    const { account, chain } = useWeb3Wallet()
    const { width } = useWindowSize()
    const router = useRouter()
    const isMobile = width && width < screens.drawer
    const [visible, setVisible] = useState<boolean>(false)
    const [isHover, setIsHover] = useState<boolean>(false)
    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)
    const [userInfo, setUserInfo] = useState<any>(null)

    // check modal subscribe able to show first time - local storage
    const [isShowModal, setIsShowModal] = useState(false)

    const onConnect = async () => {
        const provider = await detectEthereumProvider({ timeout: 0 })
        if (isMobile) {
            window.open(`https://metamask.app.link/dapp/${Config.env.APP_URL}`)
        } else {
            provider ? Config.connectWallet() : Config.toast.show('error', 'Cài đặt metamask')
        }
    }

    const network = useMemo(() => ChainDataList[chain?.id], [account, chain])

    const onChangeMenu = (e: any) => {
        if (isMobile && e?.children.length > 0) return
        if (e.router) router.push(e.router)
    }

    const handleMouseHover = (show: boolean) => {
        setIsHover(show)
    }

    const NameComponent = ({ network, accounnt, isMobile }: any) => (
        <div className="p-2 bg-hover rounded-[5px] flex items-center space-x-2">
            <img src={network?.icon} width={24} height={24} />
            <div>{network?.chain}</div>
            <div className="rounded-[5px] bg-white overflow-hidden px-2 sm:px-4 py-2">{`${account?.substr(0, isMobile ? 2 : 4)}...${account?.substr(-4)}`}</div>
            {/* <ChevronDown size={18} /> */}
            {isHover ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </div>
    )

    const props = {
        network,
        account,
        isMobile,
    }

    const getInfo = async () => {
        const { data } = await fetchApi({
            url: API_GET_INFO_USER,
            params: {
                owner: '0xFA39a930C7A3D1fEde4E1348FF74c0c5ba93D2B4',
            },
        })
        const isShownModal = getModalSubscribeStorage()
        setUserInfo(data)
        if (!data && !isShownModal) {
            setIsShowModal(true)
        } else {
            setIsShowModal(false)
        }
    }
    // get info after connect wallet
    useEffect(() => {
        if (!account || !network) return
        getInfo()
    }, [account, network])

    const [isOpenModalUpdateEmail, setIsOpenModalUpdateEmail] = useState(false)

    const handleOpenModal = () => {
        setIsOpenModalUpdateEmail(true)
        console.log('handleOpenModal -', isOpenModalUpdateEmail)
    }

    const TransformSubMenu = Config.subMenu.map((item, index) => {
        if (item?.modalName) {
            return {
                ...item,
                handleOpenModal,
            }
        }
        return item
    })

    const menuConfig = [
        { menuId: 'account-info', router: '/', name: NameComponent, parentId: 0, hideArrowIcon: true, nameComponentProps: { ...props } },
        ...TransformSubMenu,
    ]

    const handleCloseModal = () => {
        setIsShowModal(false)
        setModalSubscribeStorage('true')
    }

    return (
        <header className="header-landing h-[4rem] sm:h-[4.25rem] flex items-center px-4 mb:px-10 border-b border-divider sticky top-0 bg-white z-[50]">
            <div className="max-w-screen-layout 4xl:max-w-screen-4xl m-auto w-full flex items-center justify-between space-x-4 sm:space-x-12">
                <div className="min-w-[67px] w-[75px]">
                    <img src="/images/ic_logo.png" />
                </div>

                <UpdateEmailSubscriptionModal visible={isOpenModalUpdateEmail} onClose={() => setIsOpenModalUpdateEmail(false)} />

                <div className="w-full flex items-center justify-end mb:justify-between  py-3 mb:py-0 text-sm font-semibold">
                    {!isMobile && (
                        <div className="hidden mb:block">
                            <Menu data={Config.homeMenu} onChange={onChangeMenu} />
                            {/* <Menu data={menuConfig} onChange={onChangeMenu} network={network} acount={account} isMobile={isMobile}/> */}
                        </div>
                    )}
                    {!loading_account && (
                        <div className="flex items-center space-x-5 sm:space-x-6 cursor-pointer">
                            {network && <Notifications />}

                            {account && network && !userInfo && isShowModal && (
                                <EmailSubscriptionModal visible={!userInfo && isShowModal} onClose={handleCloseModal} />
                            )}
                            {account && network && !isMobile && (
                                <Menu data={menuConfig} cbOnMouseOut={handleMouseHover} cbOnMouseOver={handleMouseHover} />
                                // <div className="p-1 bg-hover rounded-[5px] flex items-center space-x-2">
                                //     <img src={network.icon} width={24} height={24} />
                                //     <div>{network.chain}</div>
                                //     <div className="rounded-[5px] bg-white overflow-hidden px-2 sm:px-4 py-1">
                                //         {`${account.substr(0, isMobile ? 2 : 4)}...${account.substr(-4)}`}
                                //     </div>
                                // </div>
                            )}
                            {account && network && isMobile && (
                                // <Menu data={menuConfig} network={network} acount={account} isMobile={isMobile}/>
                                <div className="p-1 bg-hover rounded-[5px] flex items-center space-x-2">
                                    <img src={network.icon} width={24} height={24} />
                                    <div>{network.chain}</div>
                                    <div className="rounded-[5px] bg-white overflow-hidden px-2 sm:px-4 py-1">
                                        {`${account.substr(0, isMobile ? 2 : 4)}...${account.substr(-4)}`}
                                    </div>
                                </div>
                            )}

                            {/* {network && isMobile && <Notifications />} */}
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
                            <Menu data={Config.homeMenuMobile} onChange={onChangeMenu} />
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
