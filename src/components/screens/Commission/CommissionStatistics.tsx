import { addMonths, addWeeks, endOfDay, startOfDay, subDays } from 'date-fns'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import DateRangePicker from 'components/common/DatePicker/DateRangePicker'
import { CalendarIcon, FilterIcon } from 'components/common/Svg/SvgIcon'
import { API_GET_FILTER_COMMISSION } from 'services/apis'
import fetchApi from 'services/fetch-api'
import colors from 'styles/colors'
import { formatNumber, formatTime } from 'utils/utils'
import CommissionFilterDateMobile from './CommissionFilterDateMobile'

interface CommissionStatistics {
    account: any
    userInfo: any
    decimal: number
    setShowWithDrawCommission: React.Dispatch<React.SetStateAction<boolean>>
    doReload: boolean
}
const CommissionStatistics = ({ account, userInfo, decimal = 2, setShowWithDrawCommission, doReload }: CommissionStatistics) => {
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

    const [commissionStatisticsData, setCommissionStatisticsData] = useState({
        ref: account.myRef,
        totalMarginIn: 0,
        totalMarginOut: 0,
    })

    const [filter, setFilter] = useState<any>({
        ...days[0],
    })

    const [showMobileDatePicker, setShowMobileDatePicker] = useState(false)

    const [picker, setPicker] = useState({
        startDate: null,
        endDate: new Date(''),
        key: 'selection',
    })

    const onChangePicker = (e: any) => {
        const from = startOfDay(e?.startDate).valueOf()
        const to = endOfDay(e?.endDate).valueOf()
        setPicker(e)
        setFilter({ from, to })
    }

    const onReset = () => {
        setFilter(days[0])
        setPicker({
            startDate: null,
            endDate: new Date(''),
            key: 'selection',
        })
    }

    useEffect(() => {
        constFetchCommissionStatistics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, doReload])

    const constFetchCommissionStatistics = async () => {
        try {
            const { data, statusCode } = await fetchApi({
                url: API_GET_FILTER_COMMISSION,
                options: { method: 'GET' },
                params: {
                    myRef: account.myRef,
                    // UNCOMMENT THIS ON PRODUCTION
                    // amount: userInfo.commissionAvailable,

                    // THIS IS FOR TEST ONLY
                    ...filter,
                },
            })
            if (statusCode === 200) {
                setCommissionStatisticsData(data)
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
        }
    }

    const timelLabel = useMemo(() => {
        const day: any = days.find((rs) => rs.id === filter.id)
        return day ? day[language] : picker.startDate ? formatTime(picker.startDate, 'dd/MM/yyyy') + '-' + formatTime(picker.endDate, 'dd/MM/yyyy') : '-'
    }, [filter, picker])

    return (
        <Background className="">
            <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                <div className="flex lg:items-center justify-between flex-col lg:flex-row">
                    <div className="md:text-xl font-semibold md:font-medium">{t('commission:reward_stats')}</div>
                    <div className="items-center space-x-4 text-sm hidden md:flex">
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
                                <div
                                    className={`px-4 py-2 rounded-full bg-hover cursor-pointer flex items-center space-x-2 ${
                                        !filter?.id ? 'bg-btnOutline font-semibold text-red' : ''
                                    }`}
                                >
                                    <CalendarIcon color={!filter?.id ? colors.red.red : colors.gray.gray} size={16} />
                                    <span>
                                        {picker?.startDate
                                            ? `${formatTime(picker?.startDate, 'dd.MM.yyyy')} - ${formatTime(picker?.endDate, 'dd.MM.yyyy')}`
                                            : t('common:custom')}
                                    </span>
                                </div>
                            )}
                        />
                        <div onClick={onReset} className="px-4 py-2 rounded-full bg-hover cursor-pointer flex items-center text-red">
                            {t('common:reset')}
                        </div>
                    </div>
                    <div className="flex md:hidden mt-6 space-x-4">
                        <div
                            className="px-4 py-[6px] rounded-full font-semibold flex items-center space-x-2 bg-hover"
                            onClick={() => setShowMobileDatePicker(true)}
                        >
                            <FilterIcon />
                            <span>{t('common:filter')}</span>
                        </div>
                        <div className="px-4 py-[6px] rounded-full font-semibold text-sm text-red flex items-center gap-2 bg-pink">
                            <CalendarIcon color={colors.red.red} size={16} />
                            {timelLabel}
                        </div>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-4 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl col-span-4 sm:col-span-2 lg:col-span-1">
                        <img src="/images/icons/ic_q_claim.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_q_claim.png" className="w-6 h-6 sm:flex hidden" />
                                <span>{t('commission:friends:total_reward')} (USDT)</span>
                            </div>
                            <div className="text-xl sm:text-2xl mt-3 sm:mt-4 font-semibold sm:font-medium">
                                {formatNumber(commissionStatisticsData?.totalMarginIn, decimal)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl col-span-4 sm:col-span-2 lg:col-span-1">
                        <img src="/images/icons/ic_swap.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_swap.png" className="w-6 h-6 sm:flex hidden" />
                                <span>{t('commission:total_withdrawn_reward')} (USDT)</span>
                            </div>
                            <div className="text-xl sm:text-2xl mt-3 sm:mt-4 font-semibold sm:font-medium">
                                {formatNumber(commissionStatisticsData?.totalMarginOut, decimal)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl col-span-4 lg:col-span-1">
                        <img src="/images/icons/ic_wallet.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_wallet.png" className="w-6 h-6 sm:flex hidden" />
                                <span>{t('commission:total_available_reward')} (USDT)</span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xl sm:text-2xl font-semibold sm:font-medium">{formatNumber(userInfo?.commissionAvailable, decimal)}</div>
                                <div
                                    className="text-center text-xs sm:text-sm px-8 py-2 font-semibold text-red cursor-pointer border border-red rounded-lg bg-btnOutline"
                                    onClick={() => setShowWithDrawCommission(true)}
                                >
                                    <span>{t('commission:withdraw')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommissionFilterDateMobile
                visible={showMobileDatePicker}
                onClose={() => setShowMobileDatePicker(false)}
                date={picker}
                setDate={setPicker}
                filter={filter}
                setFilter={setFilter}
                days={days}
            />
        </Background>
    )
}

const Background = styled.div.attrs<any>({
    className: 'mt-[4.25rem] py-8 md:py-12 px-4 mb:px-10 lg:px-20',
})`
    background-image: ${() => `url(${`/images/screens/commission/bg_commission_policy.png`})`};
    background-position: top;
    background-reat: no-repeat;
    background-size: cover;
`

export default CommissionStatistics
