import React, { useState, useImperativeHandle, useEffect, forwardRef, useRef } from 'react'
import Modal from './Modal'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import classNames from 'classnames'
import { wallets } from 'components/web3/Web3Types'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { errorsWallet } from 'utils/constants'

interface ConnectWalletModal {}

interface Wallet {
    name: string
    icon?: string
    active: boolean
    wallet?: string
}

const ConnectWalletModal = forwardRef(({}: ConnectWalletModal, ref) => {
    const { t } = useTranslation()
    const { account, error } = useWeb3Wallet()
    const [isVisible, setVisible] = useState(false)
    const [wallet, setWallet] = useState<Wallet | null>()
    const [loading, setLoading] = useState<boolean>(false)
    const actions = useRef<any>({
        onConfirm: null,
        onCancel: null,
    })

    useImperativeHandle(ref, () => ({
        show: onShow,
    }))

    useEffect(() => {
        if (isVisible && error) {
            switch (error?.code) {
                case errorsWallet.Cancel:
                    setLoading(false)
                    break
                default:
                    break
            }
        }
    }, [error, isVisible])

    useEffect(() => {
        if (account) {
            Config.toast.show('success', t('common:connect_successful'))
            setLoading(false)
            setVisible(false)
        }
    }, [account])

    const onShow = (onConfirm: () => void, onCancel: () => void) => {
        actions.current.onConfirm = onConfirm
        actions.current.onCancel = onCancel
        setVisible(true)
    }

    const onConfirm = () => {
        // if (actions.current.onConfirm) actions.current.onConfirm()
        // setVisible(false)
        setLoading(true)
        Config.web3.activate(wallet?.wallet)
    }

    const onCancel = () => {
        if (actions.current.onCancel) actions.current.onCancel()
        setVisible(false)
        setLoading(false)
        setWallet(null)
    }

    const walletsFilter: Wallet[] = [
        { name: 'Metamask', icon: '/images/icons/ic_metamask.png', active: true, wallet: wallets.metaMask },
        { name: 'Coinbase Wallet', icon: '/images/icons/ic_coinbase.png', active: true, wallet: wallets.coinbaseWallet },
        { name: 'Trustwallet', icon: '/images/icons/ic_trustwallet.png', active: false, wallet: 'Trustwallet' },
        { name: 'Khác', active: false, wallet: 'other' },
    ]

    return (
        <Modal
            isVisible={isVisible}
            isMobile={isMobile}
            onBackdropCb={onCancel}
            wrapClassName="!p-6 sm:min-w-[424px]"
            className={'w-max'}
            containerClassName="z-[9999999]"
        >
            <div className="flex flex-col space-y-4 justify-center items-center">
                {!loading && <div className="text-xl font-medium"> {t('home:home:connect_wallet')}</div>}
                {loading ? (
                    <div className="flex flex-col space-y-6">
                        <Loading>
                            <div className="bg-white w-[calc(7rem-40px)] h-[calc(7rem-40px)] flex items-center justify-center rounded-full" />
                        </Loading>
                        <div className="text-xl font-medium">{t('common:connecting')}</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
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
                                <div>{item.name}</div>
                            </CartWallet>
                        ))}
                    </div>
                )}
                <Button onClick={onConfirm} disabled={!wallet?.active ? true : false} variants="primary" className="w-full py-3 !mt-8">
                    {t('home:home:connect_wallet')}
                </Button>
                <div className="text-txtSecondary">
                    Chưa sở hữu ví? Đọc <span className="text-blue cursor-pointer underline">Hướng dẫn tạo ví</span> ngay.
                </div>
            </div>
        </Modal>
    )
})

const CartWallet = styled.div.attrs<{ active: boolean }>(({ active }) => ({
    className: classNames('p-3 flex flex-col items-center space-y-[2px] min-w-[11.25rem] bg-hover rounded-md cursor-pointer relative', {
        'after:!block': active,
    }),
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
    className: 'gradient-spin w-[7rem] h-[7rem] animate-spin-reverse flex items-center justify-center rounded-full relative',
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
