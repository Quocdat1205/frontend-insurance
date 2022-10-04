import classnames from 'classnames'
import { endOfDay, startOfDay } from 'date-fns'
import en from 'date-fns/locale/en-US'
import vi from 'date-fns/locale/vi'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import { ChevronLeft, ChevronRight, X } from 'react-feather'
import Button from 'components/common/Button/Button'
import Modal from 'components/common/Modal/Modal'
import { CalendarIcon, RightArrow } from 'components/common/Svg/SvgIcon'
import colors from 'styles/colors'
import { formatTime } from 'utils/utils'

interface InsuranceFilterMobile {
    visible: boolean
    onClose: () => void
    date: any
    setDate: (e: any) => void
    filter: any
    setFilter: (e: any) => void,
    days: any
}

const CommissionFilterDateMobile = (props: InsuranceFilterMobile) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const { visible, onClose, date, setDate, filter, setFilter, days } = props

    useEffect(() => {
        setShowPicker(false)
        setDatePicker(date)
        setOwnFilter(filter)
    }, [visible])

    const [showPicker, setShowPicker] = useState<boolean>(false)
    const [datePicker, setDatePicker] = useState(date)
    const [ownFilter, setOwnFilter] = useState(filter)

    const onConfirm = () => {
        if (showPicker) {
            setOwnFilter({
                from: startOfDay(datePicker?.startDate).valueOf(),
                to: endOfDay(datePicker?.endDate).valueOf(),
            })
            setShowPicker(false)
        } else {
            setFilter({ ...ownFilter, skip: 0 })
            setDate(datePicker)
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
                            {t('common:undo')}
                        </div>
                    </div>
                    <div className="w-full !mt-0">
                        <div className="flex items-center justify-between flex-wrap w-full">
                            {days.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        // setDatePicker({ startDate: null, endDate: new Date(''), key: 'selection' })
                                        setDatePicker({
                                            startDate: item.from,
                                            endDate: item.to,
                                            key: 'selection',
                                        })
                                        setOwnFilter(item)
                                    }}
                                    className={classnames('text-sm px-6 py-2 mt-4 bg-hover rounded-[300px] cursor-pointer', {
                                        'text-red bg-pink font-semibold': ownFilter?.id === item?.id,
                                    })}
                                >
                                    {item[language]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={`mt-4 w-full rounded-[600px] bg-hover font-semibold ${datePicker?.startDate && `text-red bg-pink`} ${showPicker && 'hidden'}`}>
                    <div onClick={() => onAction('open')}>
                        <div className="flex items-center justify-center w-full px-4 h-9 sm:h-[3rem]">
                            <div className="flex items-center space-x-2">
                                {/* {date?.startDate && <X size={16} onClick={() => onAction('clear')} />} */}
                                <div className="cursor-pointer flex justify-center gap-2">
                                    <CalendarIcon />{' '}
                                    {datePicker?.startDate ? (
                                        <div className="w-full flex items-center text-sm sm:text-base ">
                                            {datePicker?.startDate ? formatTime(datePicker?.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(datePicker?.endDate, 'dd/MM/yyyy') : ''}
                                        </div>
                                    ) : (
                                        <span className="font-medium text-sm leading-5">Tuỳ chỉnh</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${showPicker ? 'translate-x-0 min-h-[360px]' : 'translate-x-full absolute'} mt-6 transition-all`}>
                    <div className={`${!showPicker ? 'translate-x-0' : '-translate-x-full absolute'} transition-all flex flex-col space-y-6`}></div>
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

export default CommissionFilterDateMobile
