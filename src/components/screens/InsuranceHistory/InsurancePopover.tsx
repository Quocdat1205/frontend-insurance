import { Popover, Transition } from '@headlessui/react'
import Button from 'components/common/Button/Button'
import { CalendarIcon } from 'components/common/Svg/SvgIcon'
import React, { Fragment } from 'react'
import colors from 'styles/colors'
import { formatCurrency, formatNumber } from 'utils/utils'

const InsurancePopover = ({ data, renderStatus, t }: any) => {
    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button type="button" className="inline-flex items-center focus:outline-none" aria-expanded="false">
                        {renderStatus(data)}
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
                        <Popover.Panel static className={`absolute top-0 right-full mr-4 z-10 shadow-subMenu rounded-xl min-w-[448px] py-1 bg-white`}>
                            <div className="overflow-hidden font-normal">
                                <div className="p-6 flex flex-col">
                                    <div className="text-xl font-medium">
                                        Hợp đồng mã <span className="text-red">{data.row.original._id}</span>
                                    </div>
                                    <div className="text-txtSecondary flex items-center space-x-2 mt-3">
                                        <CalendarIcon color={colors.txtSecondary} size={16} />
                                        <span>Ngày chạm giá: 20/09/2022</span>
                                    </div>
                                    <div className="h-[1px] w-full bg-divider mt-6 mb-4" />
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-txtSecondary">Trạng thái HĐBH</div>
                                            <div>{renderStatus(data)}</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-txtSecondary">Q-Claim</div>
                                            <div className="font-semibold">{formatCurrency(data.row.original.q_claim, 4, 1e4)}</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-txtSecondary">R-Claim</div>
                                            <div className="font-semibold">{formatNumber(data.row.original.q_claim / data.row.original.margin, 2)}%</div>
                                        </div>
                                    </div>
                                    <Button variants="primary" className="py-3 mt-8">
                                        Mua lại
                                    </Button>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default InsurancePopover
