import classnames from 'classnames'
import Button from 'components/common/Button/Button'
import Modal from 'components/common/Modal/Modal'
import Selectbox from 'components/common/Selectbox/Selectbox'
import { CalendarIcon, InfoCircle, RightArrow } from 'components/common/Svg/SvgIcon'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'react-feather'
import colors from 'styles/colors'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { useTranslation } from 'next-i18next'
import { DateRangePicker } from 'react-date-range'
import { formatTime } from 'utils/utils'
import Tooltip from 'components/common/Tooltip/Tooltip'

interface InsuranceFilterMobile {
    visible: boolean
    onClose: () => void
    assetsToken: any[]
    asset: string | null
    setAsset: (e: any) => void
    state: string | null
    setState: (e: any) => void
    optionsState: any[]
    date: any
    setDate: (e: any) => void
    period: string
    setPeriod: (e: string) => void
    formatOptionLabel: (e: any) => void
    filter: any
    setFilter: (e: any) => void
}

const InsuranceFilterMobile = (props: InsuranceFilterMobile) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const {
        visible,
        onClose,
        assetsToken,
        asset,
        setAsset,
        optionsState,
        formatOptionLabel,
        state,
        setState,
        date,
        setDate,
        period,
        setPeriod,
        filter,
        setFilter,
    } = props

    useEffect(() => {
        setShowPicker(false)
    }, [visible])

    const [showPicker, setShowPicker] = useState<boolean>(false)
    const [datePicker, setDatePicker] = useState(date)
    const [periodPicker, setPeriodPicker] = useState(period)

    useEffect(() => {
        setDatePicker(date)
        setPeriodPicker(period)
    }, [showPicker, date, period])

    const onConfirm = () => {
        if (showPicker) {
            setDate(datePicker)
            setPeriod(periodPicker)
            setShowPicker(false)
        } else {
            setFilter({ ...filter, skip: 0 })
            onClose()
        }
    }

    const navigatorRenderer = (focusedDate: any, changeShownDate: any, props: any) => {
        return (
            <div className="flex items-center justify-between absolute px-4 w-full top-0">
                <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                    <ChevronLeft color={colors.gray.gray} size={20} />
                </div>
                <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                    <ChevronRight color={colors.gray.gray} size={20} />
                </div>
            </div>
        )
    }

    const onReset = () => {
        setAsset(null)
        setState(null)
        setPeriod('T-Start')
        setDate({ startDate: null, endDate: new Date(''), key: 'selection' })
    }

    const isClear = useRef<boolean>(false)
    const onAction = (action: string) => {
        if (action === 'clear') {
            isClear.current = true
            setDate({ startDate: null, endDate: new Date(''), key: 'selection' })
        }
        if (action === 'open') {
            if (isClear.current) {
                isClear.current = false
                return
            }
            setShowPicker(!showPicker)
        }
    }

    return (
        <Modal
            isMobile
            containerClassName="flex-col justify-end"
            isVisible={visible}
            onBackdropCb={onClose}
            customHeader={() => (
                <div className="flex items-center justify-between pb-6">
                    {showPicker ? (
                        <div className="rotate-180 cursor-pointer" onClick={() => setShowPicker(false)}>
                            <RightArrow color={colors.txtPrimary} size={20} />
                        </div>
                    ) : (
                        <div />
                    )}
                    <X onClick={onClose} size={20} className="cursor-pointer" />
                </div>
            )}
        >
            <div className="overflow-hidden relative ">
                <div className={`${!showPicker ? 'translate-x-0' : '-translate-x-full absolute'} transition-all flex flex-col space-y-6`}>
                    <div className={`flex items-center justify-between`}>
                        <div className="text-xl leanding-8 font-semibold">{t('common:filter_by')}</div>
                        <div onClick={onReset} className="text-red underline text-sm">
                            {t('common:reset')}
                        </div>
                    </div>
                    <Selectbox
                        value={asset}
                        onChange={(e: any) => setAsset(e)}
                        className="w-full md:col-span-1"
                        label={t('common:asset_type')}
                        placeholder={t('common:choose_asset_type')}
                        displayExpr="name"
                        valueExpr="symbol"
                        formatOptionLabel={formatOptionLabel}
                        options={assetsToken}
                        isClearable={true}
                    />
                    <div>
                        <div className="text-xs text-txtSecondary">{t('insurance_history:status')}</div>
                        <div className="flex items-center flex-wrap">
                            {optionsState.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setState(item?.value)}
                                    className={classnames('text-sm px-4 py-2 mt-4 mr-3 last:mr-0 bg-hover rounded-[300px] cursor-pointer', {
                                        'text-red bg-pink font-semibold': state === item?.value,
                                    })}
                                >
                                    {item?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-txtSecondary">Period</span>
                                <div data-tip={t('insurance:terminology:period')} data-for={'period'}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                </div>
                            </div>
                        </div>
                        <div onClick={() => onAction('open')}>
                            <div className="flex items-center justify-between w-full px-4 rounded-[3px] bg-hover h-[2.75rem] sm:h-[3rem]">
                                <div className="w-full flex items-center text-sm sm:text-base">
                                    {period}{' '}
                                    {date?.startDate ? formatTime(date?.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(date?.endDate, 'dd/MM/yyyy') : ''}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {date?.startDate && <X size={16} onClick={() => onAction('clear')} />}
                                    <div className="cursor-pointer">
                                        <CalendarIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${showPicker ? 'translate-x-0 min-h-[360px]' : 'translate-x-full absolute'} transition-all`}>
                    <div className="pb-6 sm:px-5 sm:pt-5 sm:pb-0 flex items-center justify-center">
                        <div className="bg-gray-1 p-1 flex items-center rounded-[3px] text-sm sm:text-base">
                            <div
                                onClick={() => setPeriodPicker('T-Start')}
                                className={`px-4 py-[2px] cursor-pointer ${periodPicker === 'T-Start' ? 'bg-white rounded-[3px]' : ''}`}
                            >
                                T-Start
                            </div>
                            <div
                                onClick={() => setPeriodPicker('T-Expired')}
                                className={`px-4 py-[2px] cursor-pointer ${periodPicker === 'T-Expired' ? 'bg-white rounded-[3px]' : ''}`}
                            >
                                T-Expired
                            </div>
                        </div>
                    </div>
                    <div className="date-range-picker flex justify-center !bg-white">
                        <DateRangePicker
                            className="relative h-full"
                            ranges={[datePicker]}
                            months={1}
                            onChange={(e: any) => setDatePicker(e[date.key])}
                            moveRangeOnFirstSelection={false}
                            direction="horizontal"
                            staticRanges={[]}
                            inputRanges={[]}
                            weekStartsOn={0}
                            rangeColors={[colors.red.red]}
                            editableDateInputs={true}
                            retainEndDateOnFirstSelection
                            navigatorRenderer={navigatorRenderer}
                            locale={language === 'vi' ? vi : en}
                        />
                    </div>
                </div>
            </div>
            <Button onClick={onConfirm} variants="primary" className="w-full text-sm h-[3rem] mt-8">
                {t(`common:${showPicker ? 'confirm' : 'filter'}`)}
            </Button>
        </Modal>
    )
}

export default InsuranceFilterMobile
