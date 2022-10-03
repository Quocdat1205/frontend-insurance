import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import Modal from 'components/common/Modal/Modal'
import LayoutWeb3 from 'components/layout/LayoutWeb3'
import CommissionPolicy from 'components/screens/Commission/CommissionPolicy'
import CommissionReferral from 'components/screens/Commission/CommissionReferral'
import CommissionStatistics from 'components/screens/Commission/CommissionStatistics'
import CommissionTable from 'components/screens/Commission/CommissionTable'
import Config from 'config/config'
import { RootStore, useAppSelector } from 'redux/store'
import { API_GET_INFO_USER_COMMISSION, API_POST_WITHDRAW_COMMISSION } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { UnitConfig } from 'types/types'
import { getUnit } from 'utils/utils'

export const commissionConfig = [
    { limit: 20000, ratio: 2, condition: 'ne', label: '<$20,000', text: '02%' },
    { limit: 50000, ratio: 3, condition: 'lt', label: '$20,000 - $50,000', text: '03%' },
    { limit: 100000, ratio: 4, condition: 'lt', label: '$50,000 - $100,000', text: '04%' },
    { limit: 150000, ratio: 5, condition: 'lt', label: '$100,000 - $150,000', text: '05%' },
    { added: 50000, ratio: 1, condition: 'add', label: 'Mỗi $50,000 thêm', text: '01% đến 10% (Khoảng $400,000)' },
]

type modalType = 'withdraw' | 'withdrawing' | 'error'

const Commission = () => {
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const unitConfig: UnitConfig = useAppSelector((state: RootStore) => getUnit(state, 'USDT'))
    const [userInfo, setUserInfo] = useState<any>(null)
    const [showWithdrawCommission, setShowWithdrawCommission] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState(10)
    const [isWithdrawing, setIsWithdrawing] = useState<modalType>('withdraw')

    const getInfo = async () => {
        try {
            const { data } = await fetchApi({
                url: API_GET_INFO_USER_COMMISSION,
                options: { method: 'GET' },
                params: {
                    owner: account?.address,
                },
            })
            if (data) setUserInfo(data)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
        }
    }

    const handleWithDrawCommissionShare = async () => {
        if (!account?.address) return
        setIsWithdrawing('withdrawing')
        try {
            const { statusCode } = await fetchApi({
                url: API_POST_WITHDRAW_COMMISSION,
                options: { method: 'POST' },
                params: {
                    owner: account?.address,
                    amount: withdrawAmount,
                },
            })
            if (statusCode === 200) {
                setIsWithdrawing('withdraw')
                Config.toast.show('success', 'Rút hoa hồng về ví thành công')
            }
            setIsWithdrawing('error')
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            setIsWithdrawing('error')
        }
    }

    useEffect(() => {
        if (account?.address) getInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account])

    const withDrawCommissionModal = () => {
        let modal = null
        switch (isWithdrawing) {
            case 'withdraw':
                modal = (
                    <>
                        <img src="/images/screens/commission/success_illus.png" />
                        <div className="mt-6 w-full text-center">
                            <div className="font-semibold text-xl leading-6">Xác nhận rút hoa hồng về ví?</div>
                            <div className="mt-2 font-medium text-sm leading-5 text-txtSecondary">Số lượng: 10,000,000.2341 USDT</div>
                        </div>
                        <div className="w-full mt-8">
                            <Button variants="primary" className="w-full py-[14px] px-6 leading-5 font-bold text-sm" onClick={handleWithDrawCommissionShare}>
                                Rút hoa hồng
                            </Button>
                        </div>
                    </>
                )
                break
            case 'withdrawing':
                modal = (
                    <>
                        <div className="w-full flex flex-col items-center justify">
                            <Loading>
                                <div className="bg-white w-[calc(5rem-30px)] h-[calc(5rem-30px)] sm:w-[calc(7rem-40px)] sm:h-[calc(7rem-40px)] flex items-center justify-center rounded-full" />
                            </Loading>
                            <div className="mt-8 font-semibold text-xl leading-6">Quá trình có thể kéo dài đến 10s</div>
                        </div>
                        <div className="w-full mt-8">
                            <Button variants="primary" className="w-full py-[14px] px-6 leading-5 font-bold text-sm">
                                Đang thực hiện rút hoa hồng
                            </Button>
                        </div>
                    </>
                )
                break
            case 'error':
                modal = (
                    <>
                        <img src="/images/icons/ic_failed.png" height="65px" width="65px" />
                        <div className="mt-6 w-full text-center">
                            <div className="font-semibold text-xl leading-6">Rút hoa hồng về ví thất bại</div>
                            <div className="mt-2 font-medium text-sm leading-5 text-txtSecondary">Lý do: Lỗi kết nối mạng</div>
                        </div>
                        <div className="w-full mt-8">
                            <Button
                                variants="primary"
                                className="w-full py-[14px] px-6 leading-5 font-bold text-sm"
                                onClick={() => setIsWithdrawing('withdraw')}
                            >
                                Rút lại
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
                isVisible={showWithdrawCommission}
                isMobile={isMobile}
                onBackdropCb={() => {
                    setShowWithdrawCommission(false)
                    setIsWithdrawing('withdraw')
                }}
                className={'mb:w-max'}
                containerClassName="py-8 px-6"
            >
                <div className="flex flex-col items-center justify-center">{modal}</div>
            </Modal>
        )
    }

    return (
        <LayoutWeb3 sponsor={false}>
            {withDrawCommissionModal()}
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="pt-20 sm:pt-10 max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <CommissionReferral account={account} decimal={unitConfig?.assetDigit} commissionConfig={commissionConfig} userInfo={userInfo} />
                </div>
            </div>
            {account?.address && (
                <CommissionStatistics
                    account={account?.address}
                    userInfo={userInfo}
                    decimal={unitConfig?.assetDigit}
                    setShowWithDrawCommission={setShowWithdrawCommission}
                />
            )}
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="pt-10 max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <CommissionTable unitConfig={unitConfig} account={account} />
                </div>
            </div>
            <CommissionPolicy commissionConfig={commissionConfig} />
        </LayoutWeb3>
    )
}

export const getServerSideProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'errors'])),
    },
})

export default Commission

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
