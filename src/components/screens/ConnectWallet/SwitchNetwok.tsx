import Button from 'components/common/Button/Button'
import Config from 'config/config'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { setAccount } from 'redux/actions/setting'
import { useAppDispatch } from 'redux/store'
import { isFunction } from 'utils/utils'

interface SwitchNetwok {
    onClose: () => void
    onSwitch: () => void
}
const SwitchNetwok = ({ onClose, onSwitch }: SwitchNetwok) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const onDisconnect = () => {
        dispatch(setAccount({ address: null, wallet: null }))
        Config.logout()
        Config.toast.show('success', t('common:disconnect_successful'))
        if (isFunction(onClose)) onClose()
    }

    return (
        <div className="flex flex-col justitfy-center items-center text-center w-full">
            <div className="w-[7.75rem] h-[7.75rem]">
                <img src="/images/icons/ic_failed.png" />
            </div>
            <div className="text-xl mt-6 font-medium">{t('common:switch_network:title')}</div>
            <div className="text-txtSecondary mt-2 text-center">{t('common:switch_network:description')}</div>

            <div className="mt-8 flex items-center space-x-4 w-full">
                <Button onClick={onSwitch} variants="primary" className="w-full py-2">
                    {t('common:switch_network:switch_network')}
                </Button>
                <Button onClick={onDisconnect} variants="outlined" className="w-full py-2">
                    {t('common:switch_network:disconnect_wallet')}
                </Button>
            </div>
        </div>
    )
}

export default SwitchNetwok
