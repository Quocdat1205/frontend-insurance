import React, { ReactNode, useEffect } from 'react'
import { getConfigAsset, getListAssetToken } from 'redux/actions/setting'
import { useAppDispatch } from 'redux/store'
import Toast from 'components/layout/Toast'
import Config from 'config/config'
import AlertModal from 'components/common/Modal/AlertModal'

interface Container {
    children: ReactNode
}

const Container = ({ children }: Container) => {
    const dispath = useAppDispatch()

    useEffect(() => {
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        let vw = window.innerWidth
        if (vw <= 360) {
            document.documentElement.style.setProperty('font-size', '14px')
        }
        dispath(getListAssetToken())
        dispath(getConfigAsset())
    }, [])

    return (
        <>
            <Toast ref={(ref: any) => (Config.toast = ref)} />
            <AlertModal portalId="alert-modal" ref={(ref: any) => (Config.alert = ref)} />
            {children}
        </>
    )
}

export default Container
