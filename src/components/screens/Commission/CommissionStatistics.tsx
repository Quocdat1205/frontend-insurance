import { addMonths, addWeeks, endOfDay, startOfDay, subDays } from 'date-fns'
import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { CalendarIcon, FilterIcon } from 'components/common/Svg/SvgIcon'
import colors from 'styles/colors'
import { formatNumber } from 'utils/utils'
import DateRangePicker from 'components/common/DatePicker/DateRangePicker'

interface CommissionStatistics {
    account: string
    userInfo: any
    decimal: number
}
const CommissionStatistics = ({ account, userInfo, decimal = 2 }: CommissionStatistics) => {
    const days = useMemo(() => {
        const now = new Date()
        return [
            {
                id: 'today',
                en: 'Today',
                vi: 'Hôm nay',
                from: startOfDay(now).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: 'yesterday',
                en: 'Yesterday',
                vi: 'Hôm qua',
                from: startOfDay(subDays(now, 1)).valueOf(),
                to: endOfDay(subDays(now, 1)).valueOf(),
            },
            {
                id: '7days',
                en: '7 days',
                vi: '7 ngày',
                from: startOfDay(addWeeks(now, -1)).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: '30days',
                en: '30 days',
                vi: '30 ngày',
                from: startOfDay(addMonths(now, -1)).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: '60days',
                en: '60 days',
                vi: '60 ngày',
                from: startOfDay(addMonths(now, -2)).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: 'all',
                en: 'All Time',
                vi: 'Tất cả',
                from: null,
                to: null,
            },
        ]
    }, [])

    const {
        t,
        i18n: { language },
    } = useTranslation()

    const [filter, setFilter] = useState({
        ...days[0],
    })

    const [picker, setPicker] = useState({
        startDate: null,
        endDate: new Date(''),
        key: 'selection',
    })

    const onChangePicker = (e: any) => {
        console.log(e)
    }

    return (
        <Background className="">
            <div className="4xl:max-w-screen-3xl m-auto">
                <div className="flex lg:items-center justify-between flex-col lg:flex-row">
                    <div className="md:text-xl font-semibold md:font-medium">Thống kê hoa hồng</div>
                    <div className="items-center space-x-4 text-sm hidden md:flex sm:mt-6">
                        {days.map((day: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => setFilter(day)}
                                className={`px-4 py-2 rounded-full bg-hover cursor-pointer ${
                                    day.id === filter?.id ? 'bg-btnOutline font-semibold text-red' : ''
                                }`}
                            >
                                {day[language]}
                            </div>
                        ))}
                        <DateRangePicker
                            value={picker}
                            onChange={onChangePicker}
                            customLabel={() => (
                                <div className="px-4 py-2 rounded-full bg-hover cursor-pointer flex items-center space-x-2">
                                    <CalendarIcon color={colors.gray.gray} size={16} />
                                    <span>Tuỳ chỉnh</span>
                                </div>
                            )}
                        />
                        <div onClick={() => setFilter(days[0])} className="px-4 py-2 rounded-full bg-hover cursor-pointer flex items-center text-red">
                            Đặt lại
                        </div>
                    </div>
                    <div className="flex md:hidden mt-6 space-x-4">
                        <div className="px-4 py-[6px] rounded-full font-semibold flex items-center space-x-2 bg-hover">
                            <FilterIcon />
                            <span>Lọc</span>
                        </div>
                        <div className="px-4 py-[6px] rounded-full font-semibold text-sm text-red flex items-center space-x-2 bg-pink">
                            <CalendarIcon color={colors.red.red} size={14} />
                            <span>24/03/2022 - 30/03/2022 </span>
                        </div>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-4 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl col-span-4 sm:col-span-2 lg:col-span-1">
                        <img src="/images/icons/ic_q_claim.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_q_claim.png" className="w-6 h-6 sm:flex hidden" />
                                <span>Tổng hoa hồng (USDT)</span>
                            </div>
                            <div className="text-xl sm:text-2xl mt-3 sm:mt-4 font-semibold sm:font-medium">120,000.1234</div>
                        </div>
                    </div>
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl col-span-4 sm:col-span-2 lg:col-span-1">
                        <img src="/images/icons/ic_swap.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_swap.png" className="w-6 h-6 sm:flex hidden" />
                                <span>Tổng hoa hồng đã rút (USDT)</span>
                            </div>
                            <div className="text-xl sm:text-2xl mt-3 sm:mt-4 font-semibold sm:font-medium">120,000.1234</div>
                        </div>
                    </div>
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl col-span-4 lg:col-span-1">
                        <img src="/images/icons/ic_wallet.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_wallet.png" className="w-6 h-6 sm:flex hidden" />
                                <span>Tổng hoa hồng khả dụng (USDT)</span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xl sm:text-2xl font-semibold sm:font-medium">{formatNumber(userInfo?.userInfo, decimal)}</div>
                                <div className="flex items-center space-x-1 text-sm sm:text-base font-semibold text-red">
                                    <span>Rút hoa hồng</span>
                                    <img src="/images/icons/ic_withdraw.png" className="w-4 h-4 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

const Background = styled.div.attrs<any>({
    className: 'mt-[4.25rem] py-8 md:py-12 px-4 mb:px-10 lg:px-20',
})`
    background-image: ${() => `url(${`/images/screens/commission/bg_commission_policy.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`

export default CommissionStatistics
