import { Popover, Transition } from '@headlessui/react'
import { NotificationsIcon } from 'components/common/Svg/SvgIcon'
import React, { Fragment } from 'react'

const Notifications = () => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button type="button" className="inline-flex items-center focus:outline-none" aria-expanded="false">
                        <div className="sm:p-2 sm:bg-hover rounded-[3px] relative">
                            <NotificationsIcon />
                            <div className="bg-red w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-[50%] absolute top-[30%] right-[20%] sm:right-[30%]" />
                        </div>
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
                        <Popover.Panel static className="absolute z-10 mt-3 shadow-subMenu rounded-xl min-w-[360px] py-1 bg-white">
                            <div className="overflow-hidden font-normal">
                                <div className="flex items-center px-6 py-4 space-x-4">
                                    <div className="min-w-[40px] min-h-[40px]">
                                        <img src="/images/icons/ic_noti_active.png" width="40" height="40" />
                                    </div>
                                    <div className="flex flex-col space-y-[2px]">
                                        <div className="text-sm">
                                            Hợp đồng bảo hiểm mã <span className="text-red">22160725070001</span> đã kết thúc khi thông báo chưa đọc
                                        </div>
                                        <span className="text-xs leading-[1rem] text-gray">Bây giờ</span>
                                    </div>
                                    <div className="min-w-[6px] min-h-[6px] bg-red rounded-[50%]" />
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default Notifications
