import CardShadow from 'components/common/Card/CardShadow'
import React, { useEffect, useRef, useState } from 'react'
import Assets from 'components/screens/HomePage/Assets'
import InsuranceContract from 'components/screens/InsuranceHistory/InsuranceContract'
import Statistics from 'components/screens/InsuranceHistory/Statistics'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useTranslation } from 'next-i18next'
import Modal from 'components/common/Modal/Modal'
import Popover from 'components/common/Popover/Popover'
import { isMobile } from 'react-device-detect'
import { API_CHECK_GUIDE_LINE, API_UPDATE_GUIDE_LINE } from 'services/apis'
import fetchApi from 'services/fetch-api'
import dynamic from 'next/dynamic'
const Guideline = dynamic(() => import('components/screens/InsuranceHistory/Guideline'), {
    ssr: false,
})

const InsuranceHistory = () => {
    const { account } = useWeb3Wallet()
    const { t } = useTranslation()
    const [showGuideModal, setShowGuideModal] = useState<boolean>(false)
    const [showTerminologyModal, setShowTerminologyModal] = useState<boolean>(false)
    const [showGuide, setShowGuide] = useState<boolean>(false)
    const refPopover = useRef<any>(null)

    useEffect(() => {
        if (showGuide) {
            setShowGuideModal(false)
        }
    }, [showGuide])

    useEffect(() => {
        if (account && isMobile) checkGuideLine()
    }, [account])

    const timer = useRef<any>(null)
    const checkGuideLine = async () => {
        clearTimeout(timer.current)
        try {
            const { data } = await fetchApi({
                url: API_CHECK_GUIDE_LINE,
                options: { method: 'GET' },
                params: {
                    owner: account,
                },
            })
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
                    owner: account,
                },
            })
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    return (
        <>
            <Guideline start={showGuide} setStart={setShowGuide} />
            <TerminologyModal isMobile={isMobile} visible={showTerminologyModal} onClose={() => setShowTerminologyModal(false)} t={t} />
            <GuidelineModal
                visible={showGuideModal}
                onClose={() => setShowGuideModal(false)}
                t={t}
                onShowTerminologyModal={() => setShowTerminologyModal(true)}
                onShowGuildline={() => setShowGuide(true)}
            />
            <div className="px-4 sm:px-10 lg:px-20">
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
                            <div className="flex flex-col w-full py-1">
                                <div onClick={() => refPopover.current?.close()} className="py-2 px-4 hover:bg-hover cursor-pointer">
                                    {t('insurance_history:tracking_and_utilizing')}
                                </div>
                                <div
                                    onClick={() => {
                                        setShowTerminologyModal(true)
                                        refPopover.current?.close()
                                    }}
                                    className="py-2 px-4 hover:bg-hover cursor-pointer"
                                >
                                    {t('insurance_history:detailed_terminology')}
                                </div>
                            </div>
                        </Popover>
                    </div>
                    {account && <Statistics />}
                    <CardShadow mobileNoShadow className="sm:mt-12 sm:p-8">
                        <InsuranceContract showGuide={showGuide} account={account} />
                    </CardShadow>
                    <div className="pt-[30px] sm:pt-12">
                        <div className="sm:text-2xl font-semibold">{t('insurance_history:new_cover_assets')}</div>
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
                    {t('insurance_history:detailed_terminology')}
                </div>
            </div>
        </Modal>
    )
}

const TerminologyModal = ({ visible, onClose, t, isMobile }: any) => {
    const terms = [
        {
            title: 'Q-Covered',
            description: t('insurance:terminology:q_covered'),
        },
        {
            title: 'P-Market',
            description: t('insurance:terminology:p_market'),
        },
        {
            title: 'P-Claim',
            description: t('insurance:terminology:p_claim'),
        },
        {
            title: 'P-Expired',
            description: t('insurance:terminology:p_expired'),
        },
        {
            title: 'P-Refund',
            description: t('insurance:terminology:p_refund'),
        },
        {
            title: 'Period',
            description: t('insurance:terminology:period'),
        },
        {
            title: 'R-Claim',
            description: t('insurance:terminology:r_claim'),
        },
        {
            title: 'Q-Claim',
            description: t('insurance:terminology:q_claim'),
        },
        {
            title: 'Margin',
            description: t('insurance:terminology:margin'),
        },
        {
            title: 'T-Start',
            description: t('insurance:terminology:t_start'),
        },
        {
            title: 'T-Expired',
            description: t('insurance:terminology:t_expired'),
        },
    ]
    return (
        <Modal isMobile={isMobile} isVisible={visible} onBackdropCb={onClose} wrapClassName="!p-6" className={'max-w-[424px]'} containerClassName="z-[100]">
            <div className="text-xl font-medium mb-8 text-center">{t('insurance_history:detailed_terminology')}</div>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider max-h-[70vh] overflow-auto -mx-6 px-6">
                {terms.map((item: any, index: number) => (
                    <div key={index} className="py-3 flex items-center">
                        <div className="whitespace-nowrap min-w-[30%]">{item.title}</div>
                        <div>{item.description}</div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default InsuranceHistory
