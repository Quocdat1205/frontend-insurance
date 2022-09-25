import React, { useState, useImperativeHandle, useEffect, forwardRef, useRef, useMemo } from 'react'
import Modal from './Modal'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import classNames from 'classnames'
import { wallets } from 'components/web3/Web3Types'
import Config from 'config/config'
import { errorsWallet } from 'utils/constants'
import { RootStore, useAppDispatch, useAppSelector } from 'redux/store'
import { onLoading, setAccount } from 'redux/actions/setting'
import ConnectionError from 'components/screens/ConnectWallet/ConnectionError'
// import detectEthereumProvider from '@metamask/detect-provider'
import InstallerWallet from 'components/screens/ConnectWallet/InstallerWallet'
import NetworkError from 'components/screens/ConnectWallet/NetworkError'
import SwitchNetwok from 'components/screens/ConnectWallet/SwitchNetwok'
import { useWeb3React } from '@web3-react/core'
import useWeb3Wallet from 'hooks/useWeb3Wallet'

interface ConnectWalletModal {}

interface Wallet {
    name: string
    icon?: string
    active: boolean
    wallet?: string
}

const ConnectWalletModal = forwardRef(({}: ConnectWalletModal, ref) => {
    const { t } = useTranslation()
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
        if (loading_account) {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                dispatch(onLoading(false))
            }, 500)
        }
    }, [account])

    useEffect(() => {
        if (address && account.address && account.address !== address) {
            dispatch(setAccount({ address: address }))
        }
    }, [account, address])

    const inValidNetword = useMemo(() => {
        return account.address ? (chainId ? Config.chains.includes(chainId) : false) : true
    }, [chainId, account])

    useEffect(() => {
        if (chainId && account.address) {
            if (!inValidNetword) {
                setTimeout(() => {
                    Config.toast.show('error', t('common:network_error'))
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
    }, [isActive, chainId, account, loading, inValidNetword])

    const connectionError = (error: any) => {
        switch (Math.abs(error?.code)) {
            case 32600:
            case 32601:
            case 32602:
            case 32603:
            case errorsWallet.Cancel:
                if (inValidNetword) {
                    reason.current = error?.message
                    setErrorConnect(true)
                }
                break
            case errorsWallet.Not_found:
                setNetworkError(true)
                break
            case errorsWallet.Success:
                Config.toast.show('success', t('common:connect_successful'))
                setVisible(false)
                break
            default:
                break
        }
        setLoading(false)
        setSwitchNetwork(!inValidNetword)
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

    const onConfirm = async () => {
        firstTime.current = false
        oldAddress.current = !oldAddress.current ? address : oldAddress.current
        switch (wallet?.wallet) {
            case wallets.metaMask:
                if (isMobile) {
                    if (!Config.isMetaMaskInstalled) {
                        window.open(`https://metamask.app.link/dapp/${Config.env.APP_URL}`)
                        return
                    }
                    Config.web3?.activate(wallets.metaMask)
                } else {
                    if (!Config.isMetaMaskInstalled) {
                        setInstaller(true)
                        return
                    }
                }
            default:
                break
        }
        if (!isMobile) Config.web3?.activate(wallet?.wallet)
        if (!oldAddress.current) return
        setErrorConnect(false)
        setLoading(true)
        try {
            const token = await Config.web3.contractCaller?.sign(oldAddress.current)
            if (!token) return
            if (token?.message || token?.code) {
                connectionError(token)
            } else {
                if (chainId && Config.chains.includes(chainId)) {
                    Config.toast.show('success', t('common:connect_successful'))
                }
                localStorage.setItem('PUBLIC_ADDRESS', oldAddress.current)
                localStorage.setItem('PUBLIC_TOKEN', token)
                if (wallet?.wallet) localStorage.setItem('PUBLIC_WALLET', wallet?.wallet)
                dispatch(setAccount({ address: oldAddress.current, wallet: wallet?.wallet }))
                setVisible(false)
            }
        } catch (error) {
            console.log('getNonce', error)
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

    const walletsFilter: Wallet[] = [
        { name: 'Metamask', icon: '/images/icons/ic_metamask.png', active: true, wallet: wallets.metaMask },
        { name: 'Coinbase Wallet', icon: '/images/icons/ic_coinbase.png', active: false, wallet: wallets.coinbaseWallet },
        { name: 'Trustwallet', icon: '/images/icons/ic_trustwallet.png', active: false, wallet: 'Trustwallet' },
        { name: 'Khác', active: false, wallet: 'other' },
    ]

    if (!isVisible) return null
    return (
        <Modal
            closeButton={!switchNetwork && !loading && inValidNetword}
            isVisible={isVisible}
            isMobile={isMobile}
            onBackdropCb={() => !switchNetwork && inValidNetword && onCancel()}
            wrapClassName={`!p-6 ${networkError ? 'sm:w-[524px]' : 'sm:w-[424px]'} `}
            className={'sm:w-max'}
            containerClassName={`${switchNetwork || !inValidNetword ? '!z-[99]' : ''}`}
        >
            <div className="flex flex-col space-y-4 justify-center items-center">
                {errorConnect && <ConnectionError message={reason.current} onReconnect={onConfirm} />}
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
                        <div className="text-txtSecondary text-sm sm:text-base">
                            Chưa sở hữu ví? Đọc <span className="text-blue cursor-pointer underline">Hướng dẫn tạo ví</span> ngay.
                        </div>
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
