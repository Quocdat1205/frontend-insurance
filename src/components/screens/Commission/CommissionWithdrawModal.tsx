import React from 'react'
import styled from 'styled-components'
import Button from 'components/common/Button/Button'
import Modal from 'components/common/Modal/Modal'
import Config from 'config/config'
import { API_POST_WITHDRAW_COMMISSION } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { formatNumber } from 'utils/utils'

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
    const handleWithDrawCommissionShare = async () => {
        if (!account?.address || !userInfo?.commissionAvailable) return
        setIsWithdrawing('withdrawing')
        try {
            const { statusCode } = await fetchApi({
                url: API_POST_WITHDRAW_COMMISSION,
                // url: 'http://localhost:8075/api/insurance/v1/withdraw-commission',
                options: { method: 'POST' },
                params: {
                    owner: account?.address,

                    // UNCOMMENT THIS ON PRODUCTION
                    // amount: userInfo.commissionAvailable,

                    // THIS IS FOR TEST ONLY
                    amount: 10,
                },
            })
            if (statusCode === 200) {
                setIsWithdrawing('withdraw')
                setShow(false)
                setDoReload(!doReload)
                Config.toast.show('success', 'Rút hoa hồng về ví thành công')
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
                        <img src="/images/screens/commission/success_illus.png" />
                        <div className="mt-6 w-full text-center">
                            <div className="font-semibold text-xl leading-6">Xác nhận rút hoa hồng về ví?</div>
                            <div className="mt-2 font-medium text-sm leading-5 text-txtSecondary">
                                Số lượng: {formatNumber(userInfo?.commissionAvailable, unitConfig?.assetDigit)} USDT
                            </div>
                        </div>
                        <div className="w-full mt-8">
                            <Button
                                disabled={!account || userInfo?.commissionAvailable <= 0}
                                variants="primary"
                                className="w-full py-[14px] px-6 leading-5 font-bold text-sm"
                                onClick={handleWithDrawCommissionShare}
                            >
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
                            <div className="mt-8 font-semibold text-xl leading-6 text-center">Quá trình có thể kéo dài đến 10s</div>
                        </div>
                        <div className="w-full mt-8">
                            <Button variants="primary" disabled className="w-full py-[14px] px-6 leading-5 font-bold text-sm">
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
                isVisible={isShow}
                isMobile={isMobile}
                onBackdropCb={() => {
                    setShow(false)
                }}
                className={'mb:w-max'}
                containerClassName="py-8 px-6"
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
