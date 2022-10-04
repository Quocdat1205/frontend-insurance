// eslint-disable-next-line import/no-extraneous-dependencies
import Big from 'big.js'
import _ from 'lodash'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import Button from 'components/common/Button/Button'
import Progressbar from 'components/common/Progressbar/Progressbar'
import { CopyIcon } from 'components/common/Svg/SvgIcon'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { formatNumber } from 'utils/utils'

interface CommissionReferral {
    account: any
    decimal: number
    commissionConfig: any[]
    userInfo: any
}
const CommissionReferral = ({ account, decimal = 2, commissionConfig, userInfo }: CommissionReferral) => {
    const { t } = useTranslation()
    const { width } = useWindowSize()

    const getCommissionRatio = (totalMargin: number) => {
        let percent = 0,
            limit = 0,
            next = 0,
            progress = 0

        const item = commissionConfig.find((rs) => totalMargin < rs.limit)
        if (item) {
            percent = item.ratio
            limit = item.limit
            next = item.ratio + 1
            progress = totalMargin / item.limit
        } else {
            const item = commissionConfig.find((rs) => rs.condition === 'add')
            const gap = totalMargin - 150000 + 1
            const ratio = 5 + item.ratio * Math.ceil(gap / item.added)
            if (ratio > 10) {
                percent = 10
                next = 10
                limit = totalMargin
                progress = 100
            } else {
                const _limit = totalMargin < 200000 ? 200000 : totalMargin < 250000 ? 250000 : totalMargin < 300000 ? 300000 : 350000
                const _ratio = +Big(ratio)
                percent = _ratio
                next = _ratio + item.ratio
                limit = _limit
                progress = +(totalMargin / _limit).toFixed(0)
            }
        }
        return {
            percent,
            limit,
            next,
            progress,
        }
    }

    const general = useMemo(() => getCommissionRatio(userInfo?.totalMarginChildren ?? 0), [userInfo])

    return (
        <>
            <div className="flex flex-col mb:flex-row items-center justify-between relative">
                <div className="flex flex-col items-center text-center sm:text-left sm:items-start  max-w-[600px]">
                    <div className="text-4xl mb:text-[3rem] mb:leading-[4rem] font-semibold">Giới thiệu thêm bạn Nhận lợi nhuận vô hạn</div>
                    <div className="mt-4 text-sm sm:text-base">Thưởng đến 10% hoa hồng mỗi khi bạn bè của bạn ký quỹ hợp đồng bảo hiểm thành công</div>
                    {!account?.address && <Button className="px-6 py-3 w-max mt-8">{t('home:home:connect_wallet')}</Button>}
                </div>
                <div className="w-full h-full max-w-[554px] lg:h-[492px] mt-12 mb:mt-0">
                    <img src="/images/screens/commission/bg_commission.png" className="w-full h-full" />
                </div>
            </div>
            {account?.address && (
                <div className="border border-red shadow-dropdown rounded-xl p-4 sm:p-6 flex flex-col md:flex-row flex-wrap lg:flex-nowrap md:items-center mt-8">
                    <div className="flex flex-col space-y-2 mr-8">
                        <div className="text-txtSecondary text-sm sm:text-base">Mã giới thiệu</div>
                        <div className="flex items-center space-x-4">
                            <span className="text-red font-medium text-xl sm:text-4xl">{account?.myRef}</span>
                            <CopyIcon
                                onClick={() => {
                                    _.throttle(() => Config.copy(account?.myRef), 200)
                                    Config.toast.show('success', 'Sao chép mã thành công')
                                }}
                                size={width && width < 640 ? 18 : 22}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 mt-4 md:mt-0 min-w-[300px]">
                        <div className="text-txtSecondary text-sm sm:text-base">Link giới thiệu</div>
                        <div className="flex items-center space-x-2">
                            <span className="font-medium sm:text-xl sm:leading-[2.75rem] whitespace-nowrap">
                                {`${Config.env.APP_URL.substr(0, 15)}...ref=${account?.myRef}`}
                            </span>
                            <CopyIcon
                                size={16}
                                className="cursor-pointer min-w-[1rem]"
                                onClick={() => {
                                    _.throttle(() => Config.copy(`${Config.env.APP_URL}?ref=${account?.myRef}`), 200)
                                    Config.toast.show('success', 'Sao chép mã thành công')
                                }}
                            />
                        </div>
                    </div>
                    <div className="bg-hover rounded-xl p-4 mt-6 lg:mt-0 lg:ml-20 sm:min-w-[390px] w-full">
                        <div className="text-txtSecondary text-sm sm:text-base mb-2">Mức hoa hồng hiện tại</div>
                        <div className="flex items-center space-x-4 md:space-x-8">
                            <div className="text-xl sm:text-5xl font-medium sm:font-semibold text-red">
                                {general.percent < 10 ? `0${general.percent || ''}` : general.percent}%
                            </div>
                            <div className="w-full flex flex-col space-y-2">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <div className="">
                                        ${formatNumber(userInfo?.totalMarginChildren, decimal)}/${formatNumber(general?.limit, decimal)}
                                    </div>
                                    <div className="text-red">Tiếp theo: {general.next < 10 ? `0${general.next || ''}` : general.next}%</div>
                                </div>
                                <Progressbar percent={general.progress} height={width && width < 640 ? 4 : 10} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CommissionReferral
