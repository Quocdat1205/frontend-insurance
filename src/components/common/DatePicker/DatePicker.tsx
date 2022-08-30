import React, { useRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { CalendarIcon } from 'components/common/Svg/SvgIcon'
import { getMonth, getYear } from 'date-fns'
import { useTranslation } from 'next-i18next'
import {  months } from 'utils/constants'
import { ChevronRight, ChevronLeft } from 'react-feather'
import colors from 'styles/colors'

interface ReactDatepicker {
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
    label?: string
}

const ReactDatepicker = (props: ReactDatepicker) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const refDatePicker = useRef<any>(null)
    const {
        label,
        placeholder = label,
        value,
        onChange,
        maxDate,
        minDate,
        dateFormat = 'dd/MM/yyyy',
        shouldCloseOnSelect = true,
        showTimeInput = false,
        showIcon = true,
        className,
    } = props

    const onOpen = () => {
        if (refDatePicker.current) refDatePicker.current.setOpen(true)
    }

    const renderCustomHeader = (e: any) => {
        return (
            <div className="react-datepicker-header">
                <div className="flex items-center justify-between">
                    {!e.prevMonthButtonDisabled ? (
                        <div className="cursor-pointer" onClick={() => e.decreaseMonth()}>
                            <ChevronLeft color={colors.gray.gray} size={20} />
                        </div>
                    ) : (
                        <div />
                    )}
                    <div className="font-semibold text-base">
                        {months?.[getMonth(e.date)]?.[language]} {getYear(e.date)}
                    </div>
                    {!e.nextMonthButtonDisabled ? (
                        <div className="cursor-pointer" onClick={() => e.increaseMonth()}>
                            <ChevronRight color={colors.gray.gray} size={20} />
                        </div>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className="text-sm">{label}</div>
            <div className="datepicker flex items-center px-4 rounded-[3px]">
                <DatePicker
                    ref={refDatePicker}
                    locale={language}
                    selected={value}
                    onChange={onChange}
                    maxDate={maxDate}
                    minDate={minDate}
                    dateFormat={dateFormat}
                    placeholderText={placeholder}
                    shouldCloseOnSelect={shouldCloseOnSelect}
                    renderCustomHeader={renderCustomHeader}
                    showTimeInput={showTimeInput}
                    useWeekdaysShort={true}
                    calendarStartDay={0}

                />
                {showIcon && (
                    <div onClick={onOpen} className="cursor-pointer">
                        <CalendarIcon />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReactDatepicker
