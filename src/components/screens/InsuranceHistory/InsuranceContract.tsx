import Button from 'components/common/Button/Button'
import ReactDatepicker from 'components/common/DatePicker/DatePicker'
import DateRangePicker from 'components/common/DatePicker/DateRangePicker'
import Selectbox from 'components/common/Selectbox/Selectbox'
import DataTable from 'components/common/Table/DataTable'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_GET_INSURANCE_BY_ADDRESS } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { stateInsurance } from 'utils/constants'
import { formatCurrency, formatTime } from 'utils/utils'
import InsuranceContractMobile from './InsuranceContractMobile'
import InsurancePopover from './InsurancePopover'
import { useAppSelector, RootStore } from 'redux/store'

interface InsuranceContract {
    account: any
}

const InsuranceContract = ({ account }: InsuranceContract) => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width <= 640
    const assetsToken = useAppSelector((state: RootStore) => state.setting.assetsToken)
    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<any>({
        count: 0,
        insurance: [],
    })

    const [filter, setFilter] = useState({
        skip: 0,
        limit: 10,
        isAll: false,
    })

    const [asset, setAsset] = useState('')
    const [state, setState] = useState('')
    const [date, setDate] = useState({
        startDate: null,
        endDate: new Date(''),
        key: 'selection',
    })
    const [period, setPeriod] = useState('T-Start')

    useEffect(() => {
        if (account) getInsurance()
    }, [filter, account])

    const getInsurance = async () => {
        setLoading(true)
        try {
            const { data, message } = await fetchApi({
                url: API_GET_INSURANCE_BY_ADDRESS,
                options: { method: 'GET' },
                params: { owner: account, ...filter },
            })
            setDataSource(data)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const optionsState = useMemo(() => {
        return Object.keys(stateInsurance).reduce((acc: any, key: any) => {
            acc.push({ name: t(`common:status:${String(key).toLowerCase()}`), value: key })
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

    const renderStatus = ({ value }: any) => {
        let bg = 'bg-gradient-blue text-blue-5'
        switch (value) {
            case stateInsurance.EXPIRED:
                bg = 'bg-gradient-gray text-gray'
                break
            case stateInsurance.PAYOUT_WAITING:
                bg = 'bg-gradient-yellow text-yellow-5'
                break
            case stateInsurance.PAID:
                bg = 'bg-gradient-green text-success'
                break
            default:
                break
        }
        return <div className={`px-3 text-sm font-semibold py-[6px] rounded-[600px] ${bg}`}>{t(`common:status:${String(value).toLowerCase()}`)}</div>
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
                Header: 'Period',
                accessor: 'period',
                minWidth: 130,
                Cell: (e: any) => renderPeriod(e),
            },
            {
                Header: 'Q-Claim',
                accessor: 'q_claim',
                minWidth: 150,
                Cell: (e: any) => <div>{formatCurrency(e.value, 4, 1e4)} USDT</div>,
            },
            {
                Header: 'P-Claim',
                accessor: 'p_claim',
                minWidth: 150,
                Cell: (e: any) => <div>{formatCurrency(e.value, 4, 1e4)} USDT</div>,
            },
            {
                Header: 'Margin',
                accessor: 'margin',
                minWidth: 150,
                Cell: (e: any) => <div>{formatCurrency(e.value, 4, 1e4)} USDT</div>,
            },
            {
                Header: t('insurance_history:status'),
                accessor: 'state',
                minWidth: 190,
                Cell: (e: any) => <InsurancePopover t={t} renderStatus={renderStatus} data={e} />,
            },
            {
                Header: t('common:insurance'),
                accessor: '_id',
                minWidth: 120,
                Cell: (e: any) => <div className="underline text-red font-light cursor-pointer">{e.value}</div>,
            },
            {
                Header: 'HashID',
                accessor: 'transaction_hash',
                minWidth: 150,
            },
        ],
        [assetsToken],
    )

    const onChangePage = (page: number) => {
        setFilter({ ...filter, skip: (page - 1) * filter.limit })
    }

    const renderContent = () => {
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
    }

    const formatOptionLabel = (item: any) => {
        return (
            <div className="flex items-center space-x-2 py-2">
                <img className="rounded-[50%]" src={item?.attachment} width={20} height={20} />
                <span className="text-sm sm:text-base">{item?.name}</span>
            </div>
        )
    }

    if (isMobile && account)
        return (
            <InsuranceContractMobile
                assetsToken={assetsToken}
                renderStatus={renderStatus}
                filter={filter}
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
                renderContent={renderContent}
                formatOptionLabel={formatOptionLabel}
            />
        )

    return (
        <div>
            {dataSource?.insurance?.length <= 0 || !account ? (
                <div className="w-full flex flex-col items-center justify-center pt-8 pb-4 sm:py-0">
                    <div>
                        <img className="max-w-[230px] sm:max-w-[310px]" src="/images/icons/bg_noData.png" />
                    </div>
                    <div className="mt-4 pb-6">{account ? t('insurance_history:you_have_no_insurance') : t('insurance_history:connecting_wallet_to_buy')}</div>
                    <Button onClick={onBuyInsurance} className="py-3 px-6 sm:px-20 sm:font-semibold rounded-xl">
                        {account ? t('common:header:buy_covered') : t('home:home:connect_wallet')}
                    </Button>
                </div>
            ) : (
                <>
                    <div className="mb-6 grid grid-rows-3 grid-cols-1 md:grid-rows-2 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-4">
                        <Selectbox
                            value={asset}
                            onChange={(e: any) => setAsset(e.value)}
                            className="w-full md:col-span-1"
                            label={t('common:asset_type')}
                            placeholder={t('common:choose_asset_type')}
                            displayExpr="name"
                            valueExpr="symbol"
                            formatOptionLabel={formatOptionLabel}
                            options={assetsToken}
                        />
                        <Selectbox
                            value={state}
                            onChange={(e: any) => setState(e.value)}
                            className="w-full md:col-span-1"
                            label={t('insurance_history:status')}
                            placeholder={t('insurance_history:choose_status')}
                            displayExpr="name"
                            valueExpr="value"
                            options={optionsState}
                        />
                        <DateRangePicker
                            renderContent={renderContent}
                            className="md:col-span-2 lg:col-span-1"
                            value={date}
                            label="Period"
                            prefix={period}
                            onChange={(e: any) => setDate(e[date.key])}
                        />
                    </div>
                    <DataTable
                        data={dataSource?.insurance ?? []}
                        total={dataSource?.count ?? 0}
                        limit={filter.limit}
                        skip={filter.skip}
                        columns={columns}
                        onChangePage={onChangePage}
                    />
                </>
            )}
        </div>
    )
}

export default InsuranceContract
