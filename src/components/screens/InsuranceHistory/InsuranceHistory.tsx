import CardShadow from 'components/common/Card/CardShadow'
import React, { useEffect, useRef, useState } from 'react'
import Assets from 'components/screens/HomePage/Assets'
import InsuranceContract from 'components/screens/InsuranceHistory/InsuranceContract'
import Statistics from 'components/screens/InsuranceHistory/Statistics'
import { useTranslation } from 'next-i18next'
import Modal from 'components/common/Modal/Modal'
import Popover from 'components/common/Popover/Popover'
import { isMobile } from 'react-device-detect'
import { API_CHECK_GUIDE_LINE, API_UPDATE_GUIDE_LINE } from 'services/apis'
import fetchApi from 'services/fetch-api'
import dynamic from 'next/dynamic'
import { RootStore, useAppSelector } from 'redux/store'
import { getUnit } from 'utils/utils'
import GlossaryModal from 'components/screens/Glossary/GlossaryModal'

const Guideline = dynamic(() => import('components/screens/InsuranceHistory/Guideline'), {
    ssr: false,
})

const InsuranceHistory = () => {
    const unitConfig = useAppSelector((state: RootStore) => getUnit(state, 'USDT'))
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const { t } = useTranslation()
    const [showGuideModal, setShowGuideModal] = useState<boolean>(false)
    const [showTerminologyModal, setShowTerminologyModal] = useState<boolean>(false)
    const [showGuide, setShowGuide] = useState<boolean>(false)
    const refPopover = useRef<any>(null)
    const seen = useRef<boolean>(true)
    const [hasInsurance, setHasInsurance] = useState<boolean>(true)

    useEffect(() => {
        if (showGuide) {
            setShowGuideModal(false)
        }
    }, [showGuide])

    useEffect(() => {
        if (account?.address && isMobile) checkGuideLine()
    }, [account])

    const timer = useRef<any>(null)
    const checkGuideLine = async () => {
        clearTimeout(timer.current)
        try {
            const { data } = await fetchApi({
                url: API_CHECK_GUIDE_LINE,
                options: { method: 'GET' },
                params: {
                    owner: account?.address,
                },
            })
            seen.current = data
            if (!data) {
                timer.current = setTimeout(() => {
                    setShowGuide(true)
                    updateGuideLine()
                }, 1000)
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const updateGuideLine = async () => {
        try {
            await fetchApi({
                url: API_UPDATE_GUIDE_LINE,
                options: { method: 'GET' },
                params: {
                    owner: account?.address,
                },
            })
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    return (
        <>
            <Guideline setShowTerminologyModal={setShowTerminologyModal} seen={seen.current} start={showGuide} setStart={setShowGuide} />
            <GlossaryModal visible={showTerminologyModal} onClose={() => setShowTerminologyModal(false)} />
            <GuidelineModal
                visible={showGuideModal}
                onClose={() => setShowGuideModal(false)}
                t={t}
                onShowTerminologyModal={() => setShowTerminologyModal(true)}
                onShowGuildline={() => setShowGuide(true)}
            />
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="pt-12 sm:pt-[4.25rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <div className={`flex items-center justify-between`}>
                        <div className="text-2xl sm:text-4xl font-semibold">{t('insurance_history:my_cover')}</div>
                        <Popover
                            ref={refPopover}
                            visible={!isMobile}
                            containerClassName="w-max"
                            label={() => (
                                <div
                                    data-tut="tour_guideline"
                                    onClick={() => isMobile && setShowGuideModal(true)}
                                    className="text-sm sm:text-base text-blue underline"
                                >
                                    {t('insurance_history:guidelines:title')}
                                </div>
                            )}
                            className="right-0 shadow-subMenu rounded-[3px] w-max"
                        >
                            <div className="flex flex-col w-full py-1 text-sm">
                                <div onClick={() => refPopover.current?.close()} className="py-[10px] px-4 hover:bg-hover cursor-pointer">
                                    {t('insurance_history:tracking_and_utilizing')}
                                </div>
                                <div
                                    onClick={() => {
                                        setShowTerminologyModal(true)
                                        refPopover.current?.close()
                                    }}
                                    className="py-[10px] px-4 hover:bg-hover cursor-pointer"
                                >
                                    {t('insurance:guild:the_glossary')}
                                </div>
                            </div>
                        </Popover>
                    </div>
                    {((account?.address && hasInsurance) || showGuide) && (
                        <Statistics account={account?.address} hasInsurance={hasInsurance} unitConfig={unitConfig} />
                    )}
                    <CardShadow mobileNoShadow className="sm:mt-12 sm:p-8">
                        <InsuranceContract
                            hasInsurance={hasInsurance}
                            setHasInsurance={setHasInsurance}
                            unitConfig={unitConfig}
                            showGuide={showGuide}
                            account={account?.address}
                        />
                    </CardShadow>
                    <div className="pt-[30px] sm:pt-12">
                        <div className="sm:text-2xl font-medium">{t('insurance_history:new_cover_assets')}</div>
                        <Assets />
                    </div>
                </div>
            </div>
        </>
    )
}

const GuidelineModal = ({ visible, onClose, t, onShowTerminologyModal, onShowGuildline }: any) => {
    return (
        <Modal isMobile containerClassName="flex-col justify-end" isVisible={visible} onBackdropCb={onClose}>
            <div className="text-xl leading-8 font-semibold mb-6">{t('insurance_history:guidelines:title')}</div>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider">
                <div onClick={onShowGuildline} className="py-4">
                    {t('insurance_history:tracking_and_utilizing')}
                </div>
                <div onClick={onShowTerminologyModal} className="py-4">
                    {t('insurance:guild:the_glossary')}
                </div>
            </div>
        </Modal>
    )
}

export default InsuranceHistory
