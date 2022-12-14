import React from 'react'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import Modal from 'components/common/Modal/Modal'
import Config from 'config/config'
import { API_POST_WITHDRAW_COMMISSION } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { formatNumber } from 'utils/utils'
import { useTranslation } from 'next-i18next'

// interface Props {
//     isWithdrawing: any
//     setIsWithdrawing
//     userInfo
//     unitConfig
//     account
//     isShow
//     isMobile
//     setShow
// }

const CommissionWithdrawModal = ({ isWithdrawing, setIsWithdrawing, userInfo, unitConfig, account, isShow, isMobile, setShow, doReload, setDoReload }: any) => {
    const { t } = useTranslation()

    const handleWithDrawCommissionShare = async () => {
        if (!account?.address || !userInfo?.commissionAvailable) return
        setIsWithdrawing('withdrawing')
        try {
            const { statusCode } = await fetchApi({
                url: API_POST_WITHDRAW_COMMISSION,
                options: { method: 'POST' },
                params: {
                    owner: account?.address,

                    // USE THIS ON PRODUCTION
                    amount: userInfo.commissionAvailable,

                    // // THIS IS FOR TEST ONLY
                    // amount: 10,
                },
            })
            if (statusCode === 200) {
                setIsWithdrawing('withdraw')
                setShow(false)
                setDoReload(!doReload)
                Config.toast.show('success', t('commission:withdraw_reward:withdraw_successful'))
            } else setIsWithdrawing('error')
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            setIsWithdrawing('error')
        }
    }

    const withDrawCommissionModal = () => {
        let modal = null
        switch (isWithdrawing) {
            case 'withdraw':
                modal = (
                    <>
                        <div className="max-w-[100px]">
                            <img src="/images/screens/commission/success_illus.png" />
                        </div>
                        <div className="mt-6 w-full text-center">
                            <div className="font-semibold text-xl leading-6">{t('commission:withdraw_reward:confirm_withdraw')}?</div>
                            <div className="mt-2 font-medium text-base leading-5 text-txtSecondary">
                                {t('commission:withdraw_reward:are_you_sure', {
                                    value: `$${formatNumber(userInfo?.commissionAvailable, unitConfig?.assetDigit)} USDT?`,
                                })}
                            </div>
                        </div>
                        <div className="w-full mt-8">
                            <Button
                                disabled={!account || userInfo?.commissionAvailable <= 0}
                                variants="primary"
                                className="w-full py-[14px] px-6 leading-5 font-bold text-base"
                                onClick={handleWithDrawCommissionShare}
                            >
                                {t('common:submit')}
                            </Button>
                        </div>
                    </>
                )
                break
            case 'withdrawing':
                modal = (
                    <>
                        <div className="w-full flex flex-col items-center justify">
                            <img className="max-w-[160px]" src="/images/gif/ic_loading.gif" />
                            <div className="mt-4 mb-8 font-medium text-xl text-center">{t('commission:withdraw_reward:withdrawing')}</div>
                        </div>
                    </>
                )
                break
            case 'error':
                modal = (
                    <>
                        <img src="/images/icons/ic_failed.png" height="80px" width="80px" />
                        <div className="mt-6 w-full text-center">
                            <div className="font-semibold text-xl leading-6">{t('commission:withdraw_reward:withdraw_failed')}</div>
                            <div className="mt-2 font-medium text-base leading-5 text-txtSecondary">
                                {t('common:reason')}: {t('errors:NETWORK_ERROR')}
                            </div>
                        </div>
                        <div className="w-full mt-8">
                            <Button
                                variants="primary"
                                className="w-full py-[14px] px-6 leading-5 font-bold text-base"
                                onClick={() => setIsWithdrawing('withdraw')}
                            >
                                {t('common:retry')}
                            </Button>
                        </div>
                    </>
                )
                break
            default:
                break
        }
        return (
            <Modal
                closeButton={true}
                isVisible={isShow}
                isMobile={isMobile}
                onBackdropCb={() => {
                    setShow(false)
                }}
                className={'mb:w-max'}
                // containerClassName="py-8 px-6"
            >
                <div className="flex flex-col items-center justify-center">{modal}</div>
            </Modal>
        )
    }

    return withDrawCommissionModal()
}

export default CommissionWithdrawModal

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
