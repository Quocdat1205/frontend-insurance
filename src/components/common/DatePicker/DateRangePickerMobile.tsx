import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import colors from 'styles/colors'
import { CalendarIcon } from 'components/common/Svg/SvgIcon'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { formatTime } from 'utils/utils'

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
    label?: string
    keyExp?: string
    renderContent?: any
    prefix?: string
}
const ReactDateRangePicker = (props: ReactDateRangePicker) => {
    const {
        i18n: { language },
    } = useTranslation()

    const refDatePicker = useRef<any>(null)
    const [showRangePicker, setShowRangePicker] = useState<boolean>(false)

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
    } = props

    const wrapperRef = useRef<any>(null)

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

    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className="text-sm">{label}</div>
            <div ref={wrapperRef} className="date-range-picker relative flex items-center justify-between px-4 rounded-[3px]">
                <div
                    className="flex items-center justify-between w-full"
                    //  onClick={() => setShowRangePicker(true)}
                >
                    <div className="w-full flex items-center text-sm sm:text-base">
                        {prefix} {value?.startDate ? formatTime(value?.startDate, dateFormat) + ' - ' + formatTime(value?.endDate, dateFormat) : ''}
                    </div>
                    {showIcon && (
                        <div className="cursor-pointer">
                            <CalendarIcon />
                        </div>
                    )}
                </div>
                {showRangePicker && (
                    <>
                        {renderContent && renderContent()}
                        <DateRangePicker
                            className="relative"
                            ranges={[value]}
                            months={2}
                            onChange={onChange}
                            moveRangeOnFirstSelection={false}
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
                    </>
                )}
            </div>
        </div>
    )
}

export default ReactDateRangePicker
