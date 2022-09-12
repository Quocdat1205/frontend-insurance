import CardShadow from 'components/common/Card/CardShadow'
import React, { useState } from 'react'
import Assets from 'components/screens/HomePage/Assets'
import InsuranceContract from 'components/screens/InsuranceHistory/InsuranceContract'
import Statistics from 'components/screens/InsuranceHistory/Statistics'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useTranslation } from 'next-i18next'
import Modal from 'components/common/Modal/Modal'
import Popover from 'components/common/Popover/Popover'
import { isMobile } from 'react-device-detect'

const InsuranceHistory = () => {
    const { account } = useWeb3Wallet()
    const { t } = useTranslation()
    const [showGuideModal, setShowGuideModal] = useState<boolean>(false)

    return (
        <>
            <GuidelineModal visible={showGuideModal} onClose={() => setShowGuideModal(false)} t={t} />
            <div className="px-4 sm:px-10 pt-12 sm:pt-[4.25rem] max-w-screen-layout m-auto">
                <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-4xl font-semibold">{t('insurance_history:my_cover')}</div>
                    <Popover
                        visible={!isMobile}
                        containerClassName="w-max"
                        label={() => (
                            <div onClick={() => isMobile && setShowGuideModal(true)} className="text-sm sm:text-base text-blue underline">
                                {t('insurance_history:guidelines')}
                            </div>
                        )}
                        className="right-0 shadow-subMenu rounded-[3px] w-max"
                    >
                        <div className="flex flex-col w-full py-1">
                            <div className="py-2 px-4 hover:bg-hover cursor-pointer">{t('insurance_history:tracking_and_utilizing')}</div>
                            <div className="py-2 px-4 hover:bg-hover cursor-pointer">{t('insurance_history:detailed_terminology')}</div>
                        </div>
                    </Popover>
                </div>
                {account && <Statistics />}
                <CardShadow mobileNoShadow className="sm:mt-12 sm:p-8">
                    <InsuranceContract account={account} />
                </CardShadow>
                <div className="pt-[30px] sm:pt-12">
                    <div className="sm:text-2xl font-semibold">{t('insurance_history:new_cover_assets')}</div>
                    <Assets />
                </div>
            </div>
        </>
    )
}

const GuidelineModal = ({ visible, onClose, t }: any) => {
    return (
        <Modal isMobile containerClassName="flex-col justify-end" isVisible={visible} onBackdropCb={onClose}>
            <div className="text-xl leading-8 font-semibold mb-6">{t('insurance_history:guidelines')}</div>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider">
                <div className="py-4">{t('insurance_history:tracking_and_utilizing')}</div>
                <div className="py-4">{t('insurance_history:detailed_terminology')}</div>
            </div>
        </Modal>
    )
}

export default InsuranceHistory
