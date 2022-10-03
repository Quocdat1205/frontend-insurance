import Button from 'components/common/Button/Button'
import DateRangePicker from 'components/common/DatePicker/DateRangePicker'
import Selectbox from 'components/common/Selectbox/Selectbox'
import DataTable from 'components/common/Table/DataTable'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { API_GET_INSURANCE_BY_ADDRESS } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { screens, stateInsurance } from 'utils/constants'
import { formatCurrency, formatNumber, formatTime, getDecimalPrice } from 'utils/utils'
import InsuranceContractMobile from './InsuranceContractMobile'
import { useAppSelector, RootStore } from 'redux/store'
import colors from 'styles/colors'
import { CalendarIcon, InfoCircle } from 'components/common/Svg/SvgIcon'
import Popover from 'components/common/Popover/Popover'
import { isMobile as mobile } from 'react-device-detect'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Tooltip from 'components/common/Tooltip/Tooltip'
import { PairConfig, StateInsurance, UnitConfig } from 'types/types'

interface InsuranceContract {
    account: any
    showGuide: boolean
    unitConfig: UnitConfig
    setHasInsurance: (e: boolean) => void
    hasInsurance: boolean
}

const renderStatus = (data: any, t: any) => {
    let bg = 'bg-gradient-blue text-blue-5'
    switch (data?.state) {
        case stateInsurance.EXPIRED:
        case stateInsurance.LIQUIDATED:
            bg = 'bg-gradient-gray text-gray'
            break
        case stateInsurance.CLAIM_WAITING:
            bg = 'bg-gradient-yellow text-yellow-5'
            break
        case stateInsurance.REFUNDED:
        case stateInsurance.CLAIMED:
            bg = 'bg-gradient-green text-success'
            break
        default:
            break
    }
    return (
        <div className={`px-3 cursor-pointer text-center text-xs sm:text-sm font-semibold py-[6px] rounded-[600px] ${bg}`}>
            {t(`common:status:${String(data?.state).toLowerCase()}`)}
        </div>
    )
}

const renderReason = (data: any, t: any) => {
    if (data?.state === stateInsurance.AVAILABLE) return
    let reason = ''
    switch (data?.state) {
        case stateInsurance.REFUNDED:
            reason = 'common:insurance_history:reason:q_refund_received'
            break
        case stateInsurance.LIQUIDATED:
            reason = 'common:insurance_history:reason:liquidated'
            break
        case stateInsurance.CLAIM_WAITING:
            reason = 'common:insurance_history:reason:p_claim_reached'
            break
        case stateInsurance.CLAIMED:
            reason = 'common:insurance_history:reason:q_claim_received'
            break
        case stateInsurance.EXPIRED:
            reason = 'common:insurance_history:reason:p_expired_reached'
            break
        default:
            break
    }
    return (
        <div className="flex items-center justify-between">
            <div className="text-txtSecondary">{t('common:reason')}</div>
            <div className="font-semibold">{t(reason)}</div>
        </div>
    )
}

export const renderContentStatus = (data: any, t: any) => {
    const router = useRouter()
    const onBuyBack = () => {
        const state = {
            type: data.asset_covered,
            p_claim: data?.p_claim,
            q_covered: data?.q_coverd,
            period: data?.period,
            margin: data?.margin,
            form_history: true,
        }
        localStorage.setItem('buy_covered_state', JSON.stringify({ ...state }))
        router.push('buy-covered')
    }
    return (
        <div className="overflow-hidden font-normal ">
            <div className="sm:p-6 flex flex-col">
                <div className="text-xl leading-8 font-semibold sm:leading-7 sm:font-medium">
                    {t('common:insurance')} <span className="text-red">{data?._id}</span>
                </div>
                {data?.state !== stateInsurance.AVAILABLE && (
                    <div className="text-txtSecondary flex items-center space-x-2 mt-2 sm:mt-3 text-sm sm:text-base">
                        <CalendarIcon color={colors.txtSecondary} size={16} />
                        <span>
                            {t('common:insurance_history:price_reaching_date')}: {formatTime(data?.updatedAt, 'dd.MM.yyyy')}
                        </span>
                    </div>
                )}
                <div className="h-[1px] w-full bg-divider mt-6 mb-4" />
                <div className="flex flex-col space-y-2 text-sm sm:text-base">
                    <div className="flex items-center justify-between">
                        <div className="text-txtSecondary">{t('common:insurance_history:status_2')}</div>
                        <div>{renderStatus(data, t)}</div>
                    </div>
                    {renderReason(data, t)}
                    <div className="flex items-center justify-between">
                        <div className="text-txtSecondary flex items-center space-x-2">
                            <span>Q-Claim</span>
                            <div data-tip={t('insurance:terminology:q_claim')} data-for={'q-claim'}>
                                <InfoCircle size={14} color={colors.txtSecondary} />
                                <Tooltip className="max-w-[200px]" id={'q-claim'} placement="right" />
                            </div>
                        </div>
                        <div className="font-semibold">
                            {formatCurrency(data?.q_claim, data?.decimalSymbol, 1e4)} {data?.assetCode}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-txtSecondary flex items-center space-x-2">
                            <span>R-Claim</span>
                            <div data-tip={t('insurance:terminology:r_claim')} data-for={'r-claim'}>
                                <InfoCircle size={14} color={colors.txtSecondary} />
                                <Tooltip className="max-w-[200px]" id={'r-claim'} placement="right" />
                            </div>
                        </div>
                        <div className="font-semibold">{formatNumber(data?.q_claim / data?.margin, 2)}%</div>
                    </div>
                </div>
                <Button onClick={onBuyBack} variants="primary" className="py-3 mt-8">
                    {t('common:buy_back')}
                </Button>
            </div>
        </div>
    )
}

const InsuranceContract = ({ account, showGuide, unitConfig, setHasInsurance, hasInsurance }: InsuranceContract) => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const router = useRouter()
    const isMobile = (width && width <= screens.drawer) || mobile
    const assetsToken = useAppSelector((state: RootStore) => state.setting.assetsToken)
    const allPairConfigs = useAppSelector((state: RootStore) => state.setting.pairConfigs)
    const [loading, setLoading] = useState<boolean>(true)
    const [dataSource, setDataSource] = useState<any>({
        count: 0,
        insurance: [],
    })
    const [filter, setFilter] = useState({
        skip: 0,
        limit: mobile ? 5 : 10,
        isAll: false,
    })
    const [asset, setAsset] = useState(null)
    const [state, setState] = useState(null)
    const [date, setDate] = useState({
        startDate: null,
        endDate: new Date(''),
        key: 'selection',
    })
    const [period, setPeriod] = useState<string>('T-Start')
    const firstTime = useRef<boolean>(true)
    const checkInsurance = useRef<boolean>(true)
    const timer = useRef<any>(null)

    useEffect(() => {
        checkInsurance.current = true
    }, [account])

    useEffect(() => {
        if (!mobile && !firstTime.current) setFilter({ ...filter, skip: 0 })
        if (firstTime.current) firstTime.current = false
    }, [asset, state, period, date, account])

    useEffect(() => {
        clearTimeout(timer.current)
        if (!allPairConfigs || allPairConfigs.length <= 0) return
        if (account) {
            getInsurance()
        } else {
            timer.current = setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [filter, account, allPairConfigs])

    const onChangePage = (page: number) => {
        if (loading) return
        setFilter({ ...filter, skip: (page - 1) * filter.limit })
    }

    const onLoadMore = () => {
        if (loading) return
        setLoading(true)
        setFilter({ ...filter, skip: filter.limit + filter.skip })
    }

    const getInsurance = async () => {
        const from = date.startDate ? new Date(date.startDate).getTime() : null
        const to = date.startDate ? new Date(date.endDate).getTime() : null
        const mode = to ? period : null
        setLoading(true)
        try {
            const { data } = await fetchApi({
                url: API_GET_INSURANCE_BY_ADDRESS,
                options: { method: 'GET' },
                params: {
                    owner: account,
                    asset_covered: asset,
                    state: state,
                    mode: mode,
                    from: from,
                    to: to,
                    ...filter,
                },
            })
            if (data) {
                data?.insurance?.map((item: any) => {
                    const symbol = allPairConfigs.find((rs: PairConfig) => rs.baseAsset === item?.asset_covered)
                    const decimalPrice = getDecimalPrice(symbol)
                    item['decimalSymbol'] = unitConfig?.assetDigit
                    item['assetCode'] = unitConfig?.assetCode
                    item['decimalPrice'] = decimalPrice
                    return item
                })
                if (checkInsurance.current) {
                    checkInsurance.current = false
                    setHasInsurance(data?.insurance.length > 0)
                }
                const dataFiter = !isMobile || !filter.skip ? data?.insurance : dataSource.insurance.concat(data?.insurance)
                setDataSource({
                    count: data?.count,
                    insurance: dataFiter,
                })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const optionsState = useMemo(() => {
        return Object.keys(stateInsurance).reduce((acc: any[], key: string) => {
            acc.push({ name: t(`common:status:${String(key).toLowerCase()}`), value: stateInsurance[key as keyof StateInsurance] })
            return acc
        }, [])
    }, [])

    const renderAsset = (e: any) => {
        const asset = assetsToken.find((rs: any) => rs.symbol === e?.value)
        return (
            <div className="flex items-center space-x-3">
                <img className="rounded-[50%]" src={asset?.attachment} width={32} height={32} />
                <span>{asset?.name}</span>
            </div>
        )
    }

    const renderPeriod = (e: any) => {
        return (
            <div className="text-red">
                {e?.value}D {formatTime(e.row.original.createdAt, 'HH:mm:ss')}
            </div>
        )
    }

    const renderHeaderTooltip = (name: string, content: string, id: string) => {
        return (
            <div className="flex items-center space-x-2">
                <span>{name}</span>
                <div data-tip={content} data-for={id}>
                    <InfoCircle size={14} color={colors.txtSecondary} />
                    <Tooltip id={id} placement="top" />
                </div>
            </div>
        )
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t('common:asset_type'),
                accessor: 'asset_covered',
                minWidth: 200,
                Cell: (e: any) => renderAsset(e),
            },
            {
                Header: () => renderHeaderTooltip('Period', t('insurance:terminology:period'), 'period'),
                accessor: 'period',
                minWidth: 130,
                Cell: (e: any) => renderPeriod(e),
            },
            {
                Header: () => renderHeaderTooltip('Q-Claim', t('insurance:terminology:q_claim'), 'q_claim'),
                accessor: 'q_claim',
                minWidth: 150,
                Cell: (e: any) => (
                    <div>
                        {formatCurrency(e.value, unitConfig?.assetDigit, 1e4)} {unitConfig?.assetCode}
                    </div>
                ),
            },
            {
                Header: renderHeaderTooltip('P-Claim', t('insurance:terminology:p_claim'), 'p_claim'),
                accessor: 'p_claim',
                minWidth: 150,
                Cell: (e: any) => (
                    <div>
                        {formatCurrency(e.value, e?.row?.original?.decimalPrice, 1e4)} {unitConfig?.assetCode}
                    </div>
                ),
            },
            {
                Header: renderHeaderTooltip('Margin', t('insurance:terminology:margin'), 'margin'),
                accessor: 'margin',
                minWidth: 150,
                Cell: (e: any) => (
                    <div>
                        {formatCurrency(e.value, e?.row?.original?.decimalPrice, 1e4)} {unitConfig?.assetCode}
                    </div>
                ),
            },
            {
                Header: t('common:insurance_history:status_2'),
                accessor: 'state',
                minWidth: 190,
                Cell: (e: any) => (
                    <Popover
                        className={`${
                            e.row?.index < 5 ? 'top-0' : 'bottom-0'
                        } absolute right-full mr-4 z-10 mt-0 shadow-subMenu rounded-xl min-w-[448px] py-1 bg-white`}
                        label={renderStatus(e.row.original, t)}
                    >
                        {renderContentStatus(e.row.original, t)}
                    </Popover>
                ),
            },
            {
                Header: t('common:insurance'),
                accessor: 'transaction_hash',
                minWidth: 120,
                Cell: (e: any) => (
                    <div className="underline text-red font-light cursor-pointer">
                        {/* <Link href={Config.env.BSC + '/' + e.value}>
                            <a target="_blank">{e.value}</a>
                        </Link> */}
                        <Link href={Config.env.BSC + '/' + e.value}>
                            <a target="_blank">{e.value?.length > 10 ? String(e.value).substr(0, 5) + '...' + String(e.value).substr(-3) : e.value}</a>
                        </Link>
                    </div>
                ),
            },
            {
                Header: 'HashID',
                accessor: '_id',
                minWidth: 150,
            },
        ],
        [assetsToken, unitConfig],
    )

    const renderContentPicker = () => {
        return (
            <div className="pb-6 sm:px-5 sm:pt-5 sm:pb-0 flex items-center justify-center">
                <div className="bg-gray-1 p-1 flex items-center rounded-[3px] text-sm sm:text-base">
                    <div
                        onClick={() => setPeriod('T-Start')}
                        className={`px-4 py-[2px] cursor-pointer ${period === 'T-Start' ? 'bg-white rounded-[3px]' : ''}`}
                    >
                        T-Start
                    </div>
                    <div
                        onClick={() => setPeriod('T-Expired')}
                        className={`px-4 py-[2px] cursor-pointer ${period === 'T-Expired' ? 'bg-white rounded-[3px]' : ''}`}
                    >
                        T-Expired
                    </div>
                </div>
            </div>
        )
    }

    const onBuyInsurance = () => {
        if (!account) {
            Config.connectWallet()
            return
        }
        router.push('/buy-covered')
    }

    const formatOptionLabel = (item: any) => {
        return (
            <div className="flex items-center space-x-2 py-2">
                <img className="rounded-[50%]" src={item?.attachment} width={20} height={20} />
                <span className="text-sm sm:text-base">{item?.name}</span>
            </div>
        )
    }

    const renderLabelPicker = () => {
        return (
            <div className="flex items-center space-x-2">
                <span>Period</span>
                <div data-tip={t('insurance:terminology:period')} data-for="period">
                    <InfoCircle size={14} color={colors.txtSecondary} />
                    <Tooltip id="period" placement="top" />
                </div>
            </div>
        )
    }

    if (isMobile && account)
        return !hasInsurance && !showGuide ? (
            <NoData account={account} t={t} onBuyInsurance={onBuyInsurance} hasInsurance={hasInsurance} />
        ) : (
            <InsuranceContractMobile
                assetsToken={assetsToken}
                renderStatus={renderStatus}
                filter={filter}
                setFilter={setFilter}
                dataSource={dataSource}
                total={dataSource?.count ?? 0}
                asset={asset}
                setAsset={setAsset}
                optionsState={optionsState}
                state={state}
                setState={setState}
                date={date}
                setDate={setDate}
                period={period}
                setPeriod={setPeriod}
                formatOptionLabel={formatOptionLabel}
                renderContentStatus={renderContentStatus}
                onLoadMore={onLoadMore}
                loading={loading}
                onBuyInsurance={onBuyInsurance}
                showGuide={showGuide}
                unitConfig={unitConfig}
                hasInsurance={hasInsurance}
            />
        )

    return (
        <>
            {account && hasInsurance && (
                <div className="mb-6 grid grid-rows-3 grid-cols-1 md:grid-rows-2 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-4">
                    <Selectbox
                        value={asset}
                        onChange={(e: any) => setAsset(e)}
                        className="w-full md:col-span-1"
                        label={t('common:asset_type')}
                        placeholder={t('common:choose_asset_type')}
                        displayExpr="name"
                        valueExpr="symbol"
                        formatOptionLabel={formatOptionLabel}
                        options={assetsToken}
                        isClearable={true}
                    />
                    <Selectbox
                        value={state}
                        onChange={(e: any) => setState(e)}
                        className="w-full md:col-span-1"
                        label={t('insurance_history:status')}
                        placeholder={t('insurance_history:choose_status')}
                        displayExpr="name"
                        valueExpr="value"
                        options={optionsState}
                        isClearable={true}
                    />
                    <DateRangePicker
                        renderContent={renderContentPicker}
                        className="md:col-span-2 lg:col-span-1"
                        value={date}
                        label={renderLabelPicker()}
                        prefix={period}
                        onChange={(e: any) => setDate(e)}
                        isClearable={true}
                    />
                </div>
            )}
            {(dataSource?.insurance?.length <= 0 || !account) && !loading ? (
                <NoData account={account} t={t} onBuyInsurance={onBuyInsurance} hasInsurance={hasInsurance} />
            ) : (
                <>
                    <DataTable
                        data={dataSource?.insurance ?? []}
                        total={dataSource?.count ?? 0}
                        limit={filter.limit}
                        skip={filter.skip}
                        columns={columns}
                        loading={loading}
                        onChangePage={onChangePage}
                    />
                </>
            )}
        </>
    )
}

const NoData = ({ hasInsurance, onBuyInsurance, t, account }: any) => {
    return (
        <div className="w-full flex flex-col items-center justify-center pt-8 pb-4 sm:py-0 sm:min-h-[300px]">
            <div className="sm:min-h-[255px]">
                <img className="max-w-[230px] sm:max-w-[310px]" src="/images/icons/bg_noData.png" />
            </div>
            <div className="mt-4 pb-6">
                {account ? t(`insurance_history:you_have_no_insurance${hasInsurance ? '_filter' : ''}`) : t('insurance_history:connecting_wallet_to_buy')}
            </div>
            <Button onClick={onBuyInsurance} className="py-3 px-6 sm:px-20 sm:font-semibold rounded-xl text-sm sm:text-base">
                {account ? t('common:header:buy_covered') : t('home:home:connect_wallet')}
            </Button>
        </div>
    )
}

export default InsuranceContract
