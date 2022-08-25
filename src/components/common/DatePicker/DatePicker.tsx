import React from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'

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
        shrink = false,
    } = props
    return (
        <div className={`flex flex-col space-y-2 ${className}`}>
            <div className="text-sm">{label}</div>
            <DatePicker
                locale={'vi'}
                selected={value}
                onChange={onChange}
                maxDate={maxDate}
                minDate={minDate}
                dateFormat={dateFormat}
                placeholderText={placeholder}
                // shouldCloseOnSelect={shouldCloseOnSelect}
                // renderCustomHeader={renderCustomHeader}
                // showTimeInput={showTimeInput}
                // ref={refDatePicker}
                // onFocus={onFocus}
                // onBlur={onBlur}
            />
        </div>
    )
}

export default ReactDatepicker
