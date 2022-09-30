import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'react-feather'
import Button from 'components/common/Button/Button'
import ButtonLanguage from 'components/common/Button/ButtonLanguage'
import Menu from 'components/common/Menu/Menu'
import { MenuIcon } from 'components/common/Svg/SvgIcon'
import Drawer from 'components/layout/Drawer'
import Notifications from 'components/layout/Notifications'
import EmailSubscriptionModal from 'components/screens/HomePage/EmailRegisterModal'
import { ChainDataList } from 'components/web3/constants/chains'
import { contractAddress } from 'components/web3/constants/contractAddress'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import useWindowSize from 'hooks/useWindowSize'
import { setAccount } from 'redux/actions/setting'
import { RootStore, useAppDispatch, useAppSelector } from 'redux/store'
import { API_GET_INFO_USER } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { screens } from 'utils/constants'
import { getModalSubscribeStorage, removeLocalStorage, setModalSubscribeStorage } from 'utils/utils'
import { contractAddress } from 'components/web3/constants/contractAddress'

const Header = () => {
    const { t } = useTranslation()
    const { chain } = useWeb3Wallet()
    const { width } = useWindowSize()
    const router = useRouter()
    const isMobile = width && width <= screens.drawer
    const [visible, setVisible] = useState<boolean>(false)
    const [isHover, setIsHover] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)
    const [userInfo, setUserInfo] = useState<any>(null)

    // check modal subscribe able to show first time - local storage
    const [showModalSubscribe, setShowModalSubscribe] = useState<boolean>(false)

    const onConnect = async () => {
        Config.connectWallet()
    }

    const network = useMemo(() => ChainDataList[chain?.id], [account, chain])

    const onChangeMenu = (e: any) => {
        if (isMobile && e?.children.length > 0) return
        if (e?.menuId && e.router) router.push(e.router)
        onClickMenuAddress(e)
        if (isMobile) setVisible(false)
    }

    const onClickMenuAddress = async (e: any) => {
        let data = null
        switch (e?.menuId) {
            case 'disconnect':
                dispatch(setAccount({ address: null, wallet: null }))
                Config.logout()
                Config.toast.show('success', t('common:disconnect_successful'))
                removeLocalStorage(Config.MODAL_REGISTER_EMAIL)
                break
            case Config.MODAL_UPDATE_EMAIL:
                // check update or register new email
                data = await getInfo()
                setShowModalSubscribe(true)
                break
            case 'recent-transaction':
                window.open(`https://bscscan.com/address/${account?.address}?fromaddress=${contractAddress}`, '_blank')
                break
            default:
                break
        }
    }

    const handleMouseHover = (show: boolean) => {
        setIsHover(show)
    }

    const NameComponent = ({ network, accounnt, isMobile }: any) => (
        <div className="sm:px-3 p-2 mb:py-2 bg-hover rounded-[5px] flex items-center space-x-2">
            {network && <img src={network?.icon} width={24} height={24} />}
            {network && <div>{network?.chain}</div>}
            <div className="rounded-[5px] bg-white overflow-hidden px-2 sm:px-4 py-1">{`${account?.address?.substr(
                0,
                isMobile ? 2 : 4,
            )}...${account?.address?.substr(-4)}`}</div>
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
        const { data, statusCode } = await fetchApi({
            url: API_GET_INFO_USER,
            params: {
                owner: account?.address,
            },
        })
        setUserInfo(data)

        const isShownModal = getModalSubscribeStorage(Config.MODAL_REGISTER_EMAIL)

        if (!data?.email && !isShownModal) {
            setShowModalSubscribe(true)
        } else {
            setModalSubscribeStorage(Config.MODAL_REGISTER_EMAIL, 'true')
        }
        return data
    }

    // get info after connect wallet
    useEffect(() => {
        if (!account?.address) return
        getInfo()
    }, [account])

    const menuAddress = [
        isMobile
            ? { menuId: 'account-info', name: 'common:header:account_info_title', parentId: 0 }
            : {
                  menuId: 'account-info',
                  name: NameComponent,
                  parentId: 0,
                  hideArrowIcon: true,
                  isDropdown: true,
                  nameComponentProps: { ...props },
              },
        ...Config.subMenu,
    ]

    const handleCloseModal = () => {
        setShowModalSubscribe(false)
    }

    const MenuFilter = useMemo(() => {
        // base menu
        const baseMenu = [...Config.homeMenu]
        // check wallet connected
        return account?.address ? [...menuAddress, ...baseMenu] : baseMenu
    }, [isMobile, account])

    console.log(userInfo, account)

    return (
        <header className="header-landing h-[4rem] sm:h-[4.25rem] flex items-center px-4 homeNav:px-10 border-b border-divider sticky top-0 bg-white z-[50]">
            <div className="flex items-center justify-between w-full m-auto space-x-4 max-w-screen-layout 4xl:max-w-screen-4xl sm:space-x-12">
                <div className="min-w-[67px] w-[75px] cursor-pointer" onClick={() => router.push('/')}>
                    <img src="/images/ic_logo.png" />
                </div>
                <div className="flex items-center justify-end w-full py-3 text-sm font-semibold  mb:justify-between mb:py-0">
                    {/* Modal */}
                    {account?.address && showModalSubscribe && (
                        <EmailSubscriptionModal isUpdate={userInfo?.email} visible={showModalSubscribe} onClose={handleCloseModal} />
                    )}

                    {!isMobile && (
                        <div className="hidden mb:block">
                            <Menu data={Config.homeMenu} onChange={onChangeMenu} />
                            {/* <Menu data={menuConfig} onChange={onChangeMenu} network={network} acount={account} isMobile={isMobile}/> */}
                        </div>
                    )}
                    {!loading_account && (
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <>
                                {account?.address && <Notifications />}
                                {account?.address && !isMobile && (
                                    <Menu data={menuAddress} cbOnMouseOut={handleMouseHover} cbOnMouseOver={handleMouseHover} onChange={onChangeMenu} />
                                )}
                                {account?.address && network && isMobile && (
                                    <div className="p-1 py-[6px] bg-hover rounded-[5px] flex items-center space-x-2">
                                        <img src={network.icon} width={24} height={24} />
                                        <div>{network.chain}</div>
                                        <div className="rounded-[5px] bg-white overflow-hidden py-1 px-2 leading-[14px]">
                                            {`${account?.address.substr(0, isMobile ? 2 : 4)}...${account?.address.substr(-4)}`}
                                        </div>
                                    </div>
                                )}
                            </>
                            {!isMobile && <ButtonLanguage />}
                            {!account?.address && (
                                <Button onClick={onConnect} className="px-4 py-2 space-x-2 font-semibold">
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
                            <Menu data={MenuFilter} onChange={onChangeMenu} />
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
