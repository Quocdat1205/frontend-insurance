import { Popover, Transition } from '@headlessui/react'
import React, { Fragment, ReactNode } from 'react'

interface ReactPopover {
    children: ReactNode
    label: any
    className?: string
}
const ReactPopover = ({ children, label, className }: ReactPopover) => {
    return (
        <Popover className="relative w-full">
            {({ open }) => (
                <>
                    <Popover.Button type="button" className="inline-flex items-center focus:outline-none w-full" aria-expanded="false">
                        {label}
                    </Popover.Button>
                    <Transition
                        show={open}
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
            )}
        </Popover>
    )
}

export default ReactPopover
