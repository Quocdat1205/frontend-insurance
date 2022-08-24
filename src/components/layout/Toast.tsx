import { SuccessCircleIcon, ErrorIcon } from 'components/common/Svg/SvgIcon'
import React, { forwardRef, useImperativeHandle } from 'react'
import { toast, Toaster, ToastBar, resolveValue } from 'react-hot-toast'
import colors from 'styles/colors'
import { OptionNotify } from 'types/types'
import { Transition } from '@headlessui/react'
import { useState } from 'react'

const Toast = forwardRef((props, ref) => {
    const [button, setButton] = useState<any>(null)

    useImperativeHandle(ref, () => ({
        show: onShow,
    }))

    const onShow = (type: string, messages: string, option: OptionNotify) => {
        const { icon, style } = getOption(type)
        toast.dismiss();
        setButton(option?.button)
        toast(messages, {
            icon: icon,
            style: style,
            duration: option?.duration || 3000,
            className: '',
        })
    }

    const getOption = (type: string) => {
        const style: any = {
            background: colors.txtPrimary,
            color: colors.white.white,
        }
        switch (type) {
            case 'success':
                return {
                    icon: <SuccessCircleIcon />,
                    style,
                }
            case 'error':
                style.background = colors.error
                return {
                    icon: <ErrorIcon />,
                    style,
                }
            default:
                return {
                    icon: <SuccessCircleIcon />,
                }
        }
    }

    return (
        <Toaster containerClassName="!top-[6.25rem]">
            {({ icon, message, visible, style, className }: any) => (
                <Transition
                    appear
                    show={visible}
                    style={style}
                    className={`${className} transform flex items-center rounded-[3px] space-x-9 px-6 py-4 leading-6`}
                    enter="transition-all duration-150"
                    enterFrom="opacity-0 scale-50"
                    enterTo="opacity-100 scale-100"
                    leave="transition-all duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-75"
                >
                    <div className="flex items-center space-x-2">
                        {icon}
                        <div className="">{message}</div>
                    </div>
                    {button}
                </Transition>
            )}
        </Toaster>
    )
})

export default Toast
