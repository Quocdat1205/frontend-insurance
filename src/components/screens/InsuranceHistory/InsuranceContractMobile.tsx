import Spinner from 'components/common/Loader/Spinner'
import Modal from 'components/common/Modal/Modal'
import { AddCircleIcon, AlarmIcon, CopyIcon, FilterIcon } from 'components/common/Svg/SvgIcon'
import Config from 'config/config'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { formatCurrency, formatTime } from 'utils/utils'
import InsuranceFilterMobile from './InsuranceFilterMobile'
import { stateInsurance } from 'utils/constants'
import { UnitConfig } from 'types/types'

interface InsuranceContractMobile {
    filter: any
    setFilter: (e: any) => void
    dataSource: any
    renderStatus: any
    total: number
    assetsToken: any[]
    asset: string | null
    setAsset: (e: any) => void
    state: string | null
    setState: (e: any) => void
    optionsState: any[]
    date: any
    setDate: (e: any) => void
    period: string
    setPeriod: (e: string) => void
    formatOptionLabel: (e: any) => void
    renderContentStatus: (e: any, t: any) => void
    onLoadMore: () => void
    loading?: boolean
    onBuyInsurance: () => void
    showGuide: boolean
    unitConfig: UnitConfig
    hasInsurance: boolean
}

const InsuranceContractMobile = ({
    filter,
    dataSource,
    renderStatus,
    total,
    assetsToken,
    renderContentStatus,
    onLoadMore,
    loading,
    onBuyInsurance,
    showGuide,
    unitConfig,
    hasInsurance,
    ...props
}: InsuranceContractMobile) => {
    const [showFilter, setShowFilter] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const rowData = useRef(null)
    const { t } = useTranslation()

    const totalPage = useMemo(() => {
        return Math.ceil(total / filter?.limit)
    }, [total, filter])

    const hasNext = useMemo(() => {
        return Math.ceil(filter.skip / filter?.limit) + 1 < totalPage || loading
    }, [filter, totalPage, loading])

    const onShowStatusModal = (item: any) => {
        rowData.current = item
        setShowStatusModal(true)
    }

    return (
        <div id="filter-contract" className="bg-hover -mx-4 px-4 sm:px-0 sm:mx-0 pb-8 pt-4">
            <StatusModal
                data={rowData.current}
                visible={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                renderContentStatus={renderContentStatus}
                t={t}
            />
            <div className="flex items-center justify-between sticky top-[calc(4rem-1px)] bg-hover py-4">
                <div className="font-semibold">{t('insurance_history:insurance_contract')}</div>
                <div onClick={() => setShowFilter(true)} className="cursor-pointer">
                    <FilterIcon />
                </div>
            </div>
            <BgDashed onClick={onBuyInsurance}>
                <AddCircleIcon />
                <span className="text-sm font-semibold text-red">{t('common:header:buy_covered')}</span>
            </BgDashed>
            <InsuranceFilterMobile assetsToken={assetsToken} visible={showFilter} onClose={() => setShowFilter(false)} filter={filter} {...props} />
            <div className="flex flex-col space-y-6">
                {!loading && dataSource?.insurance?.length <= 0 ? (
                    showGuide ? (
                        <div data-tut={'tour_insurance_contract'} className="p-4 bg-white rounded-xl flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img className="rounded-[50%]" src="/images/icons/ic_binance.png" width={32} height={32} />
                                    <div className="flex flex-col space-y-1">
                                        <div className="font-medium">Binance Coin</div>
                                        <div data-tut="tour_hashID" className="text-xs text-txtSecondary flex items-center space-x-1">
                                            <span>22160725070001</span>
                                            <CopyIcon />
                                        </div>
                                    </div>
                                </div>

                                <div data-tut="tour_status">{renderStatus({ state: stateInsurance.AVAILABLE }, t)}</div>
                            </div>
                            <div className="flex items-center justify-center space-x-2 bg-pink-1 rounded-md">
                                <AlarmIcon />
                                <span className="text-xs text-red font-semibold py-2 lowercase">7 ngày 12:30:23</span>
                            </div>
                            <div className="flex justify-between flex-wrap">
                                <Item>
                                    <div className="text-txtSecondary text-xs whitespace-nowrap">{t('common:insurance')}</div>
                                    <span className="text-xs font-semibold text-red underline">2216072507</span>
                                </Item>
                                <Item>
                                    <div className="text-txtSecondary text-xs">P-Claim</div>
                                    <span className="text-xs font-semibold">100.123K USDT</span>
                                </Item>
                                <Item className="h-[1px] border-b border-divider my-2"></Item>
                                <Item className="h-[1px] border-b border-divider my-2"></Item>
                                <Item>
                                    <div className="text-txtSecondary text-xs">Margin</div>
                                    <span className="text-xs font-semibold">1.1234K USDT</span>
                                </Item>
                                <Item>
                                    <div className="text-txtSecondary text-xs">Q-Claim</div>
                                    <span className="text-xs font-semibold">8.123K USDT</span>
                                </Item>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center pb-4 ">
                            <img className="max-w-[230px] sm:max-w-[310px]" src="/images/icons/bg_noData.png" />
                            <div className="text-sm text-center px-4">{t(`insurance_history:you_have_no_insurance${hasInsurance ? '_filter' : ''}`)}</div>
                        </div>
                    )
                ) : (
                    dataSource?.insurance?.map((item: any, index: number) => {
                        const asset = assetsToken?.find((rs: any) => rs.symbol === item?.asset_covered)
                        return (
                            <div
                                data-tut={index === 0 ? 'tour_insurance_contract' : ''}
                                key={index}
                                className="p-4 bg-white rounded-xl flex flex-col space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img className="rounded-[50%]" src={asset?.attachment} width={32} height={32} />
                                        <div className="flex flex-col space-y-1">
                                            <div className="font-medium">{asset?.name}</div>
                                            <div
                                                data-tut={'tour_hashID'}
                                                className="text-xs text-txtSecondary flex items-center space-x-1"
                                                onClick={() => navigator.clipboard.writeText(item?._id)}
                                            >
                                                <span>{item?._id}</span>
                                                <CopyIcon />
                                            </div>
                                        </div>
                                    </div>

                                    <div data-tut="tour_status" onClick={() => onShowStatusModal(item)}>
                                        {renderStatus(item, t)}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center space-x-2 bg-pink-1 rounded-md">
                                    <AlarmIcon />
                                    <span className="text-xs text-red font-semibold py-2 lowercase">
                                        {item?.period} {t('common:days')} {formatTime(item?.createdAt, 'HH:mm:ss')}
                                    </span>
                                </div>
                                <div className="flex justify-between flex-wrap">
                                    <Item>
                                        <div className="text-txtSecondary text-xs whitespace-nowrap">{t('common:insurance')}</div>
                                        <span className="text-xs font-semibold text-red underline">
                                            <Link href={Config.env.BSC + '/' + item?.transaction_hash}>
                                                <a target="_blank">
                                                    {item?.transaction_hash?.length > 10
                                                        ? String(item?.transaction_hash).substr(0, 5) + '...' + String(item?.transaction_hash).substr(-3)
                                                        : item?.transaction_hash}
                                                </a>
                                            </Link>
                                        </span>
                                    </Item>
                                    <Item>
                                        <div className="text-txtSecondary text-xs">P-Claim</div>
                                        <span className="text-xs font-semibold">
                                            {formatCurrency(item?.p_claim, item?.decimalPrice, 1e4)} {unitConfig?.assetCode}
                                        </span>
                                    </Item>
                                    <Item className="h-[1px] border-b border-divider my-2"></Item>
                                    <Item className="h-[1px] border-b border-divider my-2"></Item>
                                    <Item>
                                        <div className="text-txtSecondary text-xs">Margin</div>
                                        <span className="text-xs font-semibold">
                                            {formatCurrency(item?.margin, item?.decimalPrice, 1e4)} {unitConfig?.assetCode}
                                        </span>
                                    </Item>
                                    <Item>
                                        <div className="text-txtSecondary text-xs">Q-Claim</div>
                                        <span className="text-xs font-semibold">
                                            {formatCurrency(item?.q_claim, unitConfig?.assetDigit, 1e4)} {unitConfig?.assetCode}
                                        </span>
                                    </Item>
                                </div>
                            </div>
                        )
                    })
                )}

                {totalPage > 1 && hasNext && (
                    <div onClick={onLoadMore} className="text-red underline text-sm mt-6 flex text-center justify-center cursor-pointer">
                        {loading ? <Spinner /> : t('common:load_more')}
                    </div>
                )}
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
    className: 'flex items-center justify-center space-x-3 py-6 bg-white rounded-xl mb-6 mt-2',
})<BgDashed>`
    background-image: ${({ stroke = 2 }) =>
        `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%23E5E7E8' stroke-width='${stroke}' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`};
`
const StatusModal = ({ visible, onClose, renderContentStatus, data, t }: any) => {
    if (!data) return null
    return (
        <Modal isMobile containerClassName="flex-col justify-end" isVisible={visible} onBackdropCb={onClose}>
            {renderContentStatus(data, t)}
        </Modal>
    )
}

export default InsuranceContractMobile
