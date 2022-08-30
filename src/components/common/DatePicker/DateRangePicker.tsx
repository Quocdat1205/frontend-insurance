import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import colors from 'styles/colors'
import { CalendarIcon } from 'components/common/Svg/SvgIcon'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import useOutsideAlerter from 'hooks/useOutsideAlerter'
import { formatTime } from 'utils/utils'
import Popover from '../Popover/Popover'

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
}
const ReactDateRangePicker = (props: ReactDateRangePicker) => {
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
        keyExp = 'selection',
        renderContent,
    } = props

    const onOpen = () => {
        setShowPicker(true)
    }

    const [showPicker, setShowPicker] = useState<boolean>(false)
    const wrapperRef = useRef<any>(null)

    const [state, setState] = useState({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: keyExp,
    })

    const handleOutside = () => {
        setShowPicker(false)
    }

    useOutsideAlerter(wrapperRef, handleOutside)

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
                <Popover
                    label={() => (
                        <>
                            <div onClick={onOpen} className="w-full h-full flex items-center">
                                <span>
                                    {formatTime(state.startDate, dateFormat)} - {formatTime(state.endDate, dateFormat)}
                                </span>
                            </div>

                            {showIcon && (
                                <div onClick={onOpen} className="cursor-pointer">
                                    <CalendarIcon />
                                </div>
                            )}
                        </>
                    )}
                    className="right-0"
                >
                    <div className="rounded-xl shadow-subMenu overflow-hidden mt-[10px]">
                        {/* {showPicker && ( */}
                        {renderContent && renderContent()}
                        <DateRangePicker
                            className="relative"
                            ranges={[state]}
                            months={2}
                            onChange={(e: any) => setState(e?.[keyExp])}
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
                        {/* )} */}
                    </div>
                </Popover>
            </div>
        </div>
    )
}

export default ReactDateRangePicker
