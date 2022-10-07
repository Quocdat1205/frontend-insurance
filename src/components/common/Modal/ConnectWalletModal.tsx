import React, { useState, useImperativeHandle, useEffect, forwardRef, useRef, useMemo } from 'react'
import Modal from './Modal'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import classNames from 'classnames'
import { getAddChainParameters, wallets } from 'components/web3/Web3Types'
import Config from 'config/config'
import { errorsWallet } from 'utils/constants'
import { RootStore, useAppDispatch, useAppSelector } from 'redux/store'
import { onLoading, setAccount } from 'redux/actions/setting'
import ConnectionError from 'components/screens/ConnectWallet/ConnectionError'
import InstallerWallet from 'components/screens/ConnectWallet/InstallerWallet'
import NetworkError from 'components/screens/ConnectWallet/NetworkError'
import SwitchNetwok from 'components/screens/ConnectWallet/SwitchNetwok'
import { useWeb3React } from '@web3-react/core'
import { isString } from 'lodash'
import { API_GET_INFO_USER, API_UPDATE_USER_INFO } from 'services/apis'
import fetchApi from 'services/fetch-api'

interface ConnectWalletModal {}

interface Wallet {
    name: string
    icon?: string
    active: boolean
    wallet?: string
}

const ConnectWalletModal = forwardRef(({}: ConnectWalletModal, ref) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const dispatch = useAppDispatch()

    const { account: address, error, chainId, isActive } = useWeb3React()
    const [isVisible, setVisible] = useState(false)
    const [wallet, setWallet] = useState<Wallet | null>()
    const [loading, setLoading] = useState<boolean>(false)
    const [errorConnect, setErrorConnect] = useState<boolean>(false)
    const reason = useRef<any>(null)
    const [installer, setInstaller] = useState<boolean>(false)
    const [switchNetwork, setSwitchNetwork] = useState<boolean>(false)
    const [networkError, setNetworkError] = useState<boolean>(false)
    const firstTime = useRef<boolean>(true)
    const oldAddress = useRef<string | null>()
    const isReload = useRef<boolean>(false)
    const textErrorButton = useRef<string>(t(`common:reconnect`))
    const showIconReload = useRef<boolean>(true)
    const logged = useRef<boolean>(false)

    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)
    const account = useAppSelector((state: RootStore) => state.setting.account)

    useImperativeHandle(ref, () => ({
        show: onShow,
    }))

    useEffect(() => {
        if (isVisible && error && !firstTime.current) {
            connectionError(error)
        }
    }, [error, isVisible, isActive])

    const timer = useRef<any>(null)
    useEffect(() => {
        if (address && !account?.address && isActive && logged.current) {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                onConfirm()
            }, 500)
        }
    }, [account, address, isActive, loading_account])

    useEffect(() => {
        if (loading_account) {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                dispatch(onLoading(false))
            }, 500)
        }
    }, [account])

    const getUserInfo = async (address: string, cb: (e: any) => void) => {
        const { data } = await fetchApi({ url: API_GET_INFO_USER, params: { owner: address } })
        if (cb) cb(data)
    }

    useEffect(() => {
        if (address && account.address && account.address !== address) {
            sessionStorage.setItem('PUBLIC_ADDRESS', address)
            getUserInfo(address, (user) => {
                if (user) dispatch(setAccount({ address: address, ...user }))
            })
        }
    }, [account, address])

    const inValidNetword = useMemo(() => {
        return account.address ? (chainId ? Config.chains.includes(chainId) : false) : true
    }, [chainId, account])

    useEffect(() => {
        if (chainId && account.address) {
            if (!inValidNetword && !isVisible) {
                timer.current = setTimeout(() => {
                    Config.toast?.show('error', t('common:error_switch_network'))
                    setVisible(true)
                    firstTime.current = false
                    oldAddress.current = account.address
                    setWallet(account.wallet)
                    setSwitchNetwork(true)
                }, 200)
            } else if (inValidNetword && loading) {
                connectionError({ code: errorsWallet.Success })
            }
        }
    }, [isActive, chainId, account, loading, inValidNetword, isVisible])

    const connectionError = async (error: any) => {
        let isNotFoundNetWork = false
        const code = error?.data ? error?.data?.originalError?.code : isString(error?.code) ? error?.code : Math.abs(error?.code)
        switch (code) {
            case 32600:
            case 32601:
            case 32602:
            case 32603:
            case errorsWallet.Cancel:
                if (inValidNetword) {
                    reason.current = t('errors:40001')
                    textErrorButton.current = t(`common:reconnect`)
                    showIconReload.current = true
                    setErrorConnect(true)
                }
                break
            case errorsWallet.Not_found:
                isNotFoundNetWork = true
                clearTimeout(timer.current)
                try {
                    const params: any = getAddChainParameters(Config.chains[0], true)
                    await (window as any).ethereum
                        .request({
                            method: 'wallet_addEthereumChain',
                            params: [params],
                        })
                        .then(() => {
                            Config.toast.show('success', t('common:connect_successful'))
                            setVisible(false)
                        })
                } catch (error) {
                    setSwitchNetwork(true)
                }
                break
            case errorsWallet.Success:
                Config.toast.show('success', t('common:connect_successful'))
                setVisible(false)
                break
            case errorsWallet.NetWork_error:
                showIconReload.current = true
                reason.current = t('common:network_error')
                setErrorConnect(true)
                break
            case errorsWallet.Connect_failed:
                reason.current = t('errors:CONNECT_FAILED')
                textErrorButton.current = t(`common:refresh`)
                isReload.current = true
                setErrorConnect(true)
                break
            case errorsWallet.Already_opened:
                reason.current = t('common:user_not_login')
                showIconReload.current = false
                textErrorButton.current = t('common:got_it')
                setErrorConnect(true)
                break
            default:
                showIconReload.current = true
                reason.current = t('errors:CONNECT_FAILED')
                setErrorConnect(true)
                break
        }
        setLoading(false)
        if (!isNotFoundNetWork) setSwitchNetwork(code !== errorsWallet.Success ? !inValidNetword : false)
    }

    const onShow = () => {
        firstTime.current = true
        setVisible(true)
    }

    const onSwitch = () => {
        Config.web3.switchNetwork(Config.chains[0])
        setLoading(true)
        setSwitchNetwork(false)
    }

    const lostConnection = () => {
        connectionError({ code: errorsWallet.Connect_failed, message: t('errors:CONNECT_FAILED') })
    }

    const updateRef = async (address: string, cb: (e: any) => void) => {
        const refCode = localStorage.getItem('REF_CODE')
        if (refCode) {
            const { data } = await fetchApi({
                url: API_UPDATE_USER_INFO,
                options: {
                    method: 'PUT',
                },
                params: { owner: address, ref: refCode },
            })
            data ? cb(data) : getUserInfo(address, cb)
            localStorage.removeItem('REF_CODE')
        } else {
            getUserInfo(address, cb)
        }
    }

    const onConfirm = async () => {
        firstTime.current = false
        logged.current = true
        oldAddress.current = !oldAddress.current ? address : oldAddress.current
        switch (wallet?.wallet) {
            case wallets.metaMask:
                if (isMobile) {
                    if (!Config.isMetaMaskInstalled) {
                        const refCode = localStorage.getItem('REF_CODE')
                        window.open(`https://metamask.app.link/dapp/${Config.env.APP_URL}?ref=${refCode}`)
                        return
                    }
                    Config.web3?.activate(wallets.metaMask)
                } else {
                    if (!Config.isMetaMaskInstalled) {
                        setInstaller(true)
                        return
                    }
                }
                break
            case wallets.coinbaseWallet:
                if (isMobile) {
                    if (!Config.isMetaMaskInstalled) {
                        window.open(`https://go.cb-w.com/dapp?cb_url=${Config.env.APP_URL}`)
                        return
                    }
                }
                break
            default:
                break
        }
        if (wallet?.wallet) sessionStorage.setItem('PUBLIC_WALLET', wallet?.wallet)
        if (!isMobile) Config.web3?.activate(wallet?.wallet)
        if (!oldAddress.current) return
        setErrorConnect(false)
        setLoading(true)
        try {
            logged.current = false
            const token = await Config.web3.contractCaller?.sign(oldAddress.current)
            if (!token) {
                lostConnection()
                return
            }
            if (token?.message || token?.code) {
                connectionError(token)
            } else {
                sessionStorage.setItem('PUBLIC_ADDRESS', oldAddress.current)
                sessionStorage.setItem('PUBLIC_TOKEN', token)
                if (wallet?.wallet) localStorage.setItem('PUBLIC_WALLET', wallet?.wallet)
                updateRef(oldAddress.current, (user) => {
                    if (chainId && Config.chains.includes(chainId)) {
                        Config.toast.show('success', t('common:connect_successful'))
                    }
                    dispatch(setAccount({ address: oldAddress.current, wallet: wallet?.wallet, ...user }))
                    setVisible(false)
                })
            }
        } catch (error: any) {
            console.log('confirm', error)
        } finally {
        }
    }

    const onCancel = () => {
        setVisible(false)
        setLoading(false)
        setWallet(null)
        setErrorConnect(false)
        setInstaller(false)
        setNetworkError(false)
        setSwitchNetwork(false)
    }

    const onRead = (e: any) => {
        let el = e?.target
        while (el && el !== e.currentTarget && el.tagName !== 'SPAN') {
            el = el.parentNode
        }
        if (el && el.tagName === 'SPAN') {
            if (language === 'vi') {
                window.open('https://quocdat.gitbook.io/whitepaper-insurance/bo-huong-dan/huong-dan-su-dung-vi')
            } else {
                window.open('https://quocdat.gitbook.io/whitepaper-insurance-en/tutorial/connect-wallet-to-nami-insurance')
            }
        }
    }

    const walletsFilter: Wallet[] = [
        { name: 'Metamask', icon: '/images/icons/ic_metamask.png', active: true, wallet: wallets.metaMask },
        { name: 'Coinbase Wallet', icon: '/images/icons/ic_coinbase.png', active: false, wallet: wallets.coinbaseWallet },
        { name: 'Trustwallet', icon: '/images/icons/ic_trustwallet.png', active: false, wallet: 'Trustwallet' },
        { name: t('common:other'), active: false, wallet: 'other' },
    ]

    if (!isVisible) return null
    return (
        <Modal
            closeButton={!switchNetwork && !loading && inValidNetword}
            isVisible={isVisible}
            isMobile={isMobile}
            onBackdropCb={() => !switchNetwork && inValidNetword && onCancel()}
            wrapClassName={`!p-6 ${networkError ? 'mb:w-[524px]' : 'mb:w-[424px]'} `}
            className={'mb:w-max'}
            containerClassName={`${switchNetwork || !inValidNetword ? '!z-[99]' : ''}`}
        >
            <div className="flex flex-col space-y-4 justify-center items-center">
                {errorConnect && (
                    <ConnectionError
                        message={reason.current}
                        isReload={isReload.current}
                        onReconnect={onConfirm}
                        textErrorButton={textErrorButton.current}
                        showIcon={showIconReload.current}
                    />
                )}
                {installer && <InstallerWallet wallet={wallet?.wallet} />}
                {switchNetwork && <SwitchNetwok onClose={onCancel} onSwitch={onSwitch} />}
                {networkError && <NetworkError />}
                {!errorConnect && !installer && !switchNetwork && !networkError && (
                    <>
                        {!loading && <div className="text-xl font-medium text-left sm:text-center w-full"> {t('home:home:connect_wallet')}</div>}
                        {loading ? (
                            <div className="flex flex-col space-y-6 justify-center items-center">
                                <Loading>
                                    <div className="bg-white w-[calc(5rem-30px)] h-[calc(5rem-30px)] sm:w-[calc(7rem-40px)] sm:h-[calc(7rem-40px)] flex items-center justify-center rounded-full" />
                                </Loading>
                                <div className="text-xl font-medium">{t('common:connecting')}</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 w-full">
                                {walletsFilter.map((item: Wallet, index: number) => (
                                    <CartWallet key={index} onClick={() => setWallet(item)} active={wallet?.wallet === item?.wallet}>
                                        <div className="w-10 h-10 flex justify-center items-center relative">
                                            {item.icon ? (
                                                <img src={item.icon} className="w-10 h-10" />
                                            ) : (
                                                <div className="flex items-center space-x-1">
                                                    <div className="bg-gray w-[5px] h-[5px] rounded-full" />
                                                    <div className="bg-gray w-[5px] h-[5px] rounded-full" />
                                                    <div className="bg-gray w-[5px] h-[5px] rounded-full" />
                                                </div>
                                            )}
                                            {!item?.active && (
                                                <div className="rounded-sm whitespace-nowrap absolute bottom-0 text-[6px] text-red font-semibold border border-red py-[2px] px-1 leading-[8px] bg-white">
                                                    {t('common:coming_soon')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm sm:text-base">{item.name}</div>
                                    </CartWallet>
                                ))}
                            </div>
                        )}
                        <Button
                            onClick={onConfirm}
                            disabled={!wallet?.active ? true : false || loading}
                            variants="primary"
                            className="w-full py-3 !mt-8 text-sm sm:text-base"
                        >
                            {t('home:home:connect_wallet')}
                        </Button>
                        <div
                            onClick={onRead}
                            className="text-txtSecondary text-sm sm:text-base text-center"
                            dangerouslySetInnerHTML={{ __html: t('common:dont_have_wallet') }}
                        />
                    </>
                )}
            </div>
        </Modal>
    )
})

const CartWallet = styled.div.attrs<{ active: boolean }>(({ active }) => ({
    className: classNames(
        'p-3 flex flex-col items-center space-y-[2px] min-w-[5.5rem] w-full sm:min-w-[11.25rem] bg-hover rounded-md cursor-pointer relative',
        {
            'after:!block': active,
        },
    ),
}))<any>`
    &:after {
        display: none;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid red;
        top: 0;
        border-radius: 4px;
    }
`

const Loading = styled.div.attrs({
    className:
        'gradient-spin after:!w-[15px] after:!h-[15px] sm:after:!w-5 sm:after:!h-5 w-[5rem] h-[5rem] sm:w-[7rem] sm:h-[7rem] animate-spin-reverse flex items-center justify-center rounded-full relative',
})`
    &:after {
        content: '';
        position: absolute;
        background: #eb2b3e;
        width: 20px;
        height: 20px;
        bottom: 0;
        border-radius: 50%;
    }
`

export default ConnectWalletModal
