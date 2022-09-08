import { AddCircleIcon, AlarmIcon, FilterIcon } from 'components/common/Svg/SvgIcon'
import { useTranslation } from 'next-i18next'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { formatCurrency, formatTime } from 'utils/utils'
import InsuranceFilterMobile from './InsuranceFilterMobile'

interface InsuranceContractMobile {
    filter: any
    dataSource: any
    renderStatus: any
    total: number
    assetsToken: any[]
    asset: string
    setAsset: (e: string) => void
    state: string
    setState: (e: string) => void
    optionsState: any[]
    date: any
    setDate: (e: any) => void
    period: string
    setPeriod: (e: string) => void
    renderContent: any
    formatOptionLabel: (e: any) => void
}

const InsuranceContractMobile = ({ filter, dataSource, renderStatus, total, assetsToken, ...props }: InsuranceContractMobile) => {
    const [showFilter, setShowFilter] = useState(false)
    const { t } = useTranslation()

    const totalPage = useMemo(() => {
        return Math.ceil(total / filter?.limit)
    }, [total, filter])

    return (
        <div className="bg-hover -mx-4 px-4 sm:px-0 sm:mx-0 py-8">
            <div className="flex items-center justify-between">
                <div className="font-semibold">{t('insurance_history:insurance_contract')}</div>
                <div onClick={() => setShowFilter(true)} className="cursor-pointer">
                    <FilterIcon />
                </div>
            </div>
            <BgDashed>
                <AddCircleIcon />
                <span className="text-sm font-semibold text-red">{t('common:header:buy_covered')}</span>
            </BgDashed>
            <InsuranceFilterMobile assetsToken={assetsToken} visible={showFilter} onClose={() => setShowFilter(false)} {...props} />
            <div className="flex flex-col space-y-6">
                {dataSource?.insurance?.map((item: any, index: number) => {
                    const asset = assetsToken?.find((rs: any) => rs.symbol === item?.asset_covered)
                    return (
                        <div key={index} className="p-4 bg-white rounded-xl flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img className="rounded-[50%]" src={asset?.attachment} width={32} height={32} />
                                    <div className="flex flex-col space-y-1">
                                        <div className="font-medium">{asset?.name}</div>
                                        <div className="text-xs text-txtSecondary">{item?.transaction_hash}</div>
                                    </div>
                                </div>

                                {renderStatus({ value: item?.state })}
                            </div>
                            <div className="flex items-center justify-center space-x-2 bg-pink-1 rounded-md">
                                <AlarmIcon />
                                <span className="text-xs text-red font-semibold py-2">
                                    {item?.period} ngày {formatTime(item?.createdAt, 'HH:mm:ss')}
                                </span>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <Item>
                                    <div className="text-txtSecondary text-xs whitespace-nowrap">Hợp đồng</div>
                                    <span className="text-xs font-semibold text-red underline">{item._id}</span>
                                </Item>
                                <Item>
                                    <div className="text-txtSecondary text-xs">P-Claim</div>
                                    <span className="text-xs font-semibold">{formatCurrency(item?.p_claim, 4, 1e4)} USDT</span>
                                </Item>
                                <Item className="h-[1px] border-b border-divider my-2"></Item>
                                <Item className="h-[1px] border-b border-divider my-2"></Item>
                                <Item>
                                    <div className="text-txtSecondary text-xs">Margin</div>
                                    <span className="text-xs font-semibold">{formatCurrency(item?.margin, 4, 1e4)} USDT</span>
                                </Item>
                                <Item>
                                    <div className="text-txtSecondary text-xs">Q-Claim</div>
                                    <span className="text-xs font-semibold">{formatCurrency(item?.q_claim, 4, 1e4)} USDT</span>
                                </Item>
                            </div>
                        </div>
                    )
                })}

                {totalPage > 1 && <div className="text-red underline text-sm mt-6 text-center cursor-pointer">Xem thêm</div>}
            </div>
        </div>
    )
}

const Item = styled.div.attrs({
    className: 'flex items-center justify-between space-x-2 w-[calc(100%/2-10px)]',
})<any>`
    span {
        text-align: right;
        word-break: break-all;
    }
`

type BgDashed = {
    stroke?: number
}

const BgDashed = styled.div.attrs({
    className: 'flex items-center justify-center space-x-3 py-6 bg-white rounded-xl my-6',
})<BgDashed>`
    background-image: ${({ stroke = 2 }) =>
        `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23E5E7E8' stroke-width='${stroke}' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`};
`

export default InsuranceContractMobile
