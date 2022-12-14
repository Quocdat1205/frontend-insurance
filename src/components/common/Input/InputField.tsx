import cx from 'classnames'
import React, { useState } from 'react'
import { ErrorTriggersIcon, TriggerErrorIconCircle } from 'components/common/Svg/SvgIcon'
import { isFunction } from 'utils/utils'

export type InputProps = {
    value: any
    placeholder: string
    onChange: any
    className: string
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
    isTextArea?: boolean
    validator?: { message: string; isValid: boolean }
    label?: string
    onKeyDown?: (e: any) => void
    id?: string
    disabled?: boolean
    onPaste?: (e?: any) => void
    containerClassName?: string
    labelClassName?: string
    vertical?: boolean
}

const defaultInputCls = 'bg-hover w-full py-3 px-4 h-11 sm:h-12 rounded-[3px] ' + 'px-3 py-3 placeholder-gray-400 text-sm focus:outline-none '

const defaultAreaCls =
    ' resize-none bg-hover border-none px-3 py-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none '

const animationCls = 'ease-linear transition-all duration-150'

const InputField = ({
    className,
    reference,
    inputClassName,
    isTextArea,
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
    label,
    id = 'id',
    onKeyDown,
    placeholder,
    disabled = false,
    vertical = true,
    containerClassName = '',
    labelClassName = '',
    ...inputProps
}: Partial<InputProps>) => {
    const [focus, setFocus] = useState<boolean>(false)

    const isError = value && validator && Object.keys(validator)?.length && !validator?.isValid

    const _onFocus = (e: any) => {
        setFocus(true)
        if (onFocus) {
            onFocus(e)
        }
    }

    const _onBlur = (e: any) => {
        setFocus(false)
        if (onBlur) onBlur(e)
    }

    return (
        <div
            className={cx(
                `flex mb-4 relative`,
                { 'flex-col items-start': vertical, 'bg-hover items-center p-2': !vertical, 'border border-error': isError && !vertical },
                containerClassName,
            )}
        >
            {label && (
                <label htmlFor={id} className={cx(`text-sm text-txtSecondary`, { 'pb-2': vertical }, labelClassName)}>
                    {label}
                </label>
            )}
            {isError && focus && !vertical && validator?.message && (
                <div className="absolute right-0 -top-11 sm:-top-12 text-xs z-[100] bg-white border border-red p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                        <ErrorTriggersIcon />
                        <div dangerouslySetInnerHTML={{ __html: validator?.message }} />
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center space-x-2 w-full">
                {customPrefix && <div className={cx('outline-none', prefixClassName)}>{customPrefix && customPrefix()}</div>}
                {!isTextArea ? (
                    <input
                        id={id}
                        value={value}
                        type={'text'}
                        className={cx([
                            inputClassName,
                            { ' text-sm lg:text-base border border-error': isError && vertical, 'text-gray bg-[#EFF0F2]': disabled },
                            defaultInputCls,
                            // animationCls,
                        ])}
                        placeholder={placeholder ?? label}
                        onChange={onChange}
                        disabled={disabled}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        onKeyDown={(e) => {
                            if (onKeyDown && isFunction(onKeyDown)) {
                                if (e.key === 'Enter') {
                                    onKeyDown(e)
                                }
                            }
                        }}
                        {...inputProps}
                    />
                ) : (
                    <textarea
                        id={id}
                        value={value}
                        rows={4}
                        disabled={disabled}
                        onChange={onChange}
                        onKeyDown={(e) => {
                            if (onKeyDown && isFunction(onKeyDown)) {
                                if (e.key === 'Enter') {
                                    onKeyDown(e)
                                }
                            }
                        }}
                        aria-placeholder={'placeholder'}
                        className={cx([className, { 'border border-error': isError }, defaultAreaCls, animationCls])}
                        placeholder={placeholder || 'Type something...'}
                        {...inputProps}
                    ></textarea>
                )}
                {customSuffix && <div className={cx('outline-none', suffixClassName)}>{customSuffix()}</div>}
            </div>
            {isError && validator?.message && vertical && (
                <div className="text-xs mt-2 text-error">
                    <div className="flex items-center space-x-2">
                        <ErrorTriggersIcon />
                        <div dangerouslySetInnerHTML={{ __html: validator?.message }} />
                    </div>
                </div>
            )}
        </div>
    )
}

export const ErrorSectionNote = ({ content }: { content: any }) => (
    <div className={'w-full bg-hover mb-5 py-2 font-normal px-4'}>
        <div className="text-xs text-red md:text-base">
            <div className="flex items-start space-x-2">
                <TriggerErrorIconCircle />
                <div
                    dangerouslySetInnerHTML={{
                        __html: content,
                    }}
                />
            </div>
        </div>
    </div>
)

export default InputField
