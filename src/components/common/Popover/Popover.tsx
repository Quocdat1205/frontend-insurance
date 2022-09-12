import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, ReactNode } from 'react'

interface ReactPopover {
    children: ReactNode
    label: any
    className?: string
    reference?: any
    containerClassName?: string
    visible?: boolean
}
const ReactPopover = ({ children, label, className, reference, containerClassName = '', visible = true }: ReactPopover) => {
    return (
        <Popover ref={reference} className={`relative ${containerClassName}`}>
            {({ open, close }) => {
                return (
                    <>
                        <Popover.Button type="button" className="inline-flex items-center focus:outline-none w-full" aria-expanded="false">
                            {label}
                        </Popover.Button>
                        {/* <Popover.Overlay className="fixed inset-0 bg-red opacity-30" /> */}
                        <Transition
                            show={open && visible}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel static className={`${className} absolute z-10 mt-3 bg-white`}>
                                {children}
                            </Popover.Panel>
                        </Transition>
                    </>
                )
            }}
        </Popover>
    )
}

export default ReactPopover
