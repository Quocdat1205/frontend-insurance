import { ReactNode, useEffect } from 'react'
import { getConfigAsset, getConfigUnit, getListAssetToken, setting } from 'redux/actions/setting'
import { RootStore, useAppDispatch, useAppSelector } from 'redux/store'
import Toast from 'components/layout/Toast'
import Config from 'config/config'
import AlertModal from 'components/common/Modal/AlertModal'
import ConnectWalletModal from 'components/common/Modal/ConnectWalletModal'
import initPublicSocket from 'redux/actions/publicSocket'
import { useRouter } from 'next/router'
import { isMobile } from 'react-device-detect'

interface Container {
    children: ReactNode
}

const Container = ({ children }: Container) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const loading_account = useAppSelector((state: RootStore) => state.setting.loading_account)

    useEffect(() => {
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        let vw = window.innerWidth
        if (vw <= 360) {
            document.documentElement.style.setProperty('font-size', '14px')
        }
        dispatch(setting())
        dispatch(getListAssetToken())
        dispatch(getConfigAsset())
        dispatch(getConfigUnit())
        dispatch(initPublicSocket())
    }, [])

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const refCode = urlParams.get('ref')
        if (refCode && !account?.ref && !loading_account) {
            localStorage.setItem('REF_CODE', refCode)
            if (isMobile && !Config.isMetaMaskInstalled) Config.connectWallet()
        }
    }, [router, account, loading_account])

    return (
        <>
            <ConnectWalletModal ref={(ref: any) => (Config.refConnectWallet = ref)} />
            <Toast ref={(ref: any) => (Config.toast = ref)} />
            <AlertModal portalId="alert-modal" ref={(ref: any) => (Config.alert = ref)} />
            {children}
        </>
    )
}

export default Container
