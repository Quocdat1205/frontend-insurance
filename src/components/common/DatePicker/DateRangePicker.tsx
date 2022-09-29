import { useTranslation } from 'next-i18next'
import React, { useRef, useState, Fragment, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'react-feather'
import colors from 'styles/colors'
import { CalendarIcon } from 'components/common/Svg/SvgIcon'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { formatTime } from 'utils/utils'
import Button from 'components/common/Button/Button'
import { Transition } from '@headlessui/react'
import useOutsideAlerter from 'hooks/useOutsideAlerter'
import classNames from 'classnames'

interface ReactDateRangePicker {
    placeholder?: string
    value?: any
    onChange?: any
    maxDate?: any
    minDate?: any
    dateFormat?: string
    shouldCloseOnSelect?: boolean
    showTimeInput?: boolean
    showIcon?: boolean
    className?: any
    shrink?: boolean
    label?: any
    keyExp?: string
    renderContent?: any
    prefix?: string
    isClearable?: boolean
    isRange?: boolean
    customLabel?: any
}
const ReactDateRangePicker = (props: ReactDateRangePicker) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const refDatePicker = useRef<any>(null)
    const popoverRef = useRef(null)
    const {
        label,
        placeholder = label,
        value,
        onChange,
        maxDate,
        minDate,
        dateFormat = 'dd/MM/yyyy',
        showIcon = true,
        className,
        renderContent,
        prefix,
        isClearable = false,
        isRange = true,
        customLabel,
    } = props

    const wrapperRef = useRef<any>(null)
    const [date, setDate] = useState(value)
    const [showPicker, setShowPicker] = useState<boolean>(false)

    const handleOutside = () => {
        setShowPicker(false)
    }

    useOutsideAlerter(wrapperRef, handleOutside)

    useEffect(() => {
        setDate(value)
    }, [value, showPicker])

    const navigatorRenderer = (focusedDate: any, changeShownDate: any, props: any) => {
        return (
            <div className="flex items-center justify-between absolute px-4 w-full top-[1.375rem]">
                <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                    <ChevronLeft color={colors.gray.gray} size={20} />
                </div>
                <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                    <ChevronRight color={colors.gray.gray} size={20} />
                </div>
            </div>
        )
    }

    const _onChange = (e: any) => {
        if (isRange) {
            setDate(e[date.key])
        } else {
            setDate({
                key: date.key,
                startDate: e,
                endDate: e,
            })
        }
    }

    const onConfirm = (close: any) => {
        if (onChange) onChange(date)
        setShowPicker(false)
        // close()
    }

    const isClear = useRef<boolean>(false)
    const onAction = (action: string) => {
        if (action === 'clear') {
            isClear.current = true
            if (onChange) onChange({ ...date, startDate: null, endDate: new Date('') })
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
        <div className={classNames('flex flex-col', { 'space-y-2': label }, className)}>
            {label && <div className="text-sm text-txtSecondary">{label}</div>}
            <div ref={wrapperRef} className={classNames('date-range-picker relative', { '': !customLabel })}>
                <div onClick={() => onAction('open')} className="flex items-center w-full space-x-2 relative">
                    {customLabel ? (
                        customLabel()
                    ) : (
                        <div className="px-4 rounded-[3px] bg-hover h-[2.75rem] sm:h-[3rem] flex items-center">
                            <div className="w-full h-full flex items-center">
                                <span>
                                    {prefix} {value?.startDate ? formatTime(value?.startDate, dateFormat) + ' - ' + formatTime(value?.endDate, dateFormat) : ''}
                                </span>
                            </div>
                            {isClearable && value?.startDate && (
                                <div className="min-w-[1rem]" onClick={() => onAction('clear')}>
                                    <X size={16} />
                                </div>
                            )}

                            {showIcon && (
                                <div className="cursor-pointer">
                                    <CalendarIcon />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Transition
                    show={showPicker}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <div className={`${className} right-0 absolute z-10 top-[3.5rem] bg-white`}>
                        <div className="rounded-xl shadow-subMenu overflow-hidden">
                            {renderContent && renderContent()}
                            <DateRangePicker
                                className={`relative h-full ${!isRange ? 'single-select' : ''}`}
                                date={date.startDate}
                                ranges={[date]}
                                months={2}
                                onChange={_onChange}
                                moveRangeOnFirstSelection={!isRange}
                                direction="horizontal"
                                locale={language === 'vi' ? vi : en}
                                staticRanges={[]}
                                inputRanges={[]}
                                weekStartsOn={0}
                                rangeColors={[colors.red.red]}
                                editableDateInputs={true}
                                retainEndDateOnFirstSelection
                                navigatorRenderer={navigatorRenderer}
                            />
                            <div className="mx-6 mt-3 mb-8">
                                <Button onClick={() => onConfirm(close)} variants="primary" className="w-full text-sm h-[3rem]">
                                    {t('common:confirm')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    )
}

export default ReactDateRangePicker
