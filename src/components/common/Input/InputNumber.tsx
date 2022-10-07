import React, { useState } from 'react'
import cx from 'classnames'
import NumberFormat from 'react-number-format'
import { ErrorTriggersIcon } from 'components/common/Svg/SvgIcon'
export type InputProps = {
    value: any
    placeholder: string
    onChange: any
    className: string
    disabled: boolean
    inputClassName?: string
    reference?: HTMLInputElement
    onFocus?: (e: any) => void
    onBlur?: (e: any) => void
    prefix?: any
    customPrefix?: any
    prefixClassName?: string
    suffix?: any
    suffixClassName?: string
    customSuffix?: any
    decimal?: number
    validator?: { message: string; isValid: boolean }
    ref?: any
    id?: string
}
const InputNumber = ({
    className,
    reference,
    inputClassName,
    onFocus,
    onBlur,
    customPrefix,
    prefixClassName,
    customSuffix,
    suffixClassName,
    decimal = 0,
    validator,
    onChange,
    value,
    id,
    ...inputProps
}: Partial<InputProps>) => {
    const [focus, setFocus] = useState<boolean>(false)

    const isError = value > 0 && validator && Object.keys(validator)?.length && !validator?.isValid

    const _onFocus = (e: any) => {
        setFocus(true)
        if (onFocus) onFocus(e)
    }

    const _onBlur = (e: any) => {
        setFocus(false)
        if (onBlur) onBlur(e)
    }

    const showValue = (value: any) => {
        if (value == -1) return ''
        if (!value) {
            return null
        }
        return value.toString()
    }

    return (
        <div className={cx('h-11 sm:h-12 rounded-[3px] px-3 py-3 bg-hover w-full relative flex', { 'border border-error': isError }, className)}>
            {isError && focus && validator?.message && (
                <div className="absolute right-0 -top-11 sm:-top-12 text-xs z-[100] bg-white border border-red p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                        <ErrorTriggersIcon />
                        <div dangerouslySetInnerHTML={{ __html: validator?.message }} />
                    </div>
                </div>
            )}
            <div className="flex items-center space-x-2 w-full">
                {customPrefix && <div className={cx('outline-none', prefixClassName)}>{customPrefix && customPrefix()}</div>}
                <NumberFormat
                    id={id}
                    thousandSeparator
                    getInputRef={(ref: HTMLInputElement) => (reference = ref)}
                    type="text"
                    value={showValue(value)}
                    className={cx('text-left bg-transparent outline-none w-full', inputClassName)}
                    onFocus={_onFocus}
                    onBlur={_onBlur}
                    decimalScale={decimal}
                    allowedDecimalSeparators={[',', '.']}
                    onValueChange={onChange}
                    inputMode="decimal"
                    {...inputProps}
                />
                {customSuffix && <div className={cx('outline-none', suffixClassName)}>{customSuffix()}</div>}
            </div>
        </div>
    )
}

export default InputNumber
