import React, { ReactNode, useEffect } from 'react'
import { getListAssetToken } from 'redux/actions/setting'
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
        dispath(getListAssetToken())
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
