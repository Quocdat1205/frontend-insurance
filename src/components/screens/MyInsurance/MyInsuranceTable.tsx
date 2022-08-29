import Button from 'components/common/Button/Button'
import ReactDatepicker from 'components/common/DatePicker/DatePicker'
import Selectbox from 'components/common/Selectbox/Selectbox'
import DataTable from 'components/common/Table/DataTable'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { API_GET_INSURANCE_BY_ADDRESS } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { stateInsurance } from 'utils/constants'
import { formatCurrency, formatTime } from 'utils/utils'

const MyInsuranceTable = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState<boolean>(false)
    const { account } = useWeb3Wallet()
    const [dataSource, setDataSource] = useState<any>({
        count: 0,
        list_insurance: [],
    })

    const [filter, setFilter] = useState({
        asset: null,
        skip: 0,
        limit: 10,
        isAll: false,
    })

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

    const renderAsset = (e: any) => {
        return e?.value
    }

    const renderPeriod = (e: any) => {
        return (
            <div className="text-red">
                {e?.value} {formatTime(e.row.original.createdAt, 'HH:mm:ss')}
            </div>
        )
    }

    const renderStatus = (e: any) => {
        let bg = 'bg-gradient-blue text-blue-5'
        switch (e.value) {
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
        return <div className={`px-3 text-sm font-semibold py-[6px] rounded-[600px] ${bg}`}>{t(`common:status:${String(e.value).toLowerCase()}`)}</div>
    }

    const columns = React.useMemo(
        () => [
            {
                Header: 'Loại tài sản',
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
                Header: 'Trạng thái HĐBH',
                accessor: 'state',
                minWidth: 190,
                Cell: (e: any) => renderStatus(e),
            },
            {
                Header: 'Hợp đồng',
                accessor: '_id',
                minWidth: 120,
                Cell: (e: any) => <div className="underline text-blue font-light">{e.value}</div>,
            },
            {
                Header: 'HashID',
                accessor: 'transaction_hash',
                minWidth: 150,
            },
        ],
        [],
    )

    const options = [
        { value: 'chocolate', label: 'Chocolate', isDisabled: true },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ]
    return (
        <div>
            {dataSource?.list_insurance.length <= 0 ? (
                <div className="w-full flex flex-col items-center justify-center">
                    <div>
                        <img className="max-w-[310px]" src="/images/icons/bg_noData.png" />
                    </div>
                    <div className="mt-4 pb-6">Bạn hiện không có hợp đồng bảo hiểm nào.</div>
                    <Button className="py-3 px-20 font-semibold rounded-xl">Mua bảo hiểm</Button>
                </div>
            ) : (
                <>
                    <div className="mb-6 grid grid-rows-4 grid-cols-1 sm:grid-rows-2 sm:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4 gap-4">
                        <Selectbox
                            value={filter.asset}
                            onChange={(e) => setFilter({ ...filter, asset: e.value })}
                            className="w-full"
                            label="Loại tài sản"
                            displayExpr="label"
                            valueExpr="value"
                            options={options}
                        />
                        <ReactDatepicker label="T-Start" />
                        {/* <Selectbox className="w-full" label="Trạng thái hợp đồng" options={options} />
                        <Selectbox className="w-full" label="Loại tài sản" options={options} />
                        <Selectbox className="w-full" label="Trạng thái hợp đồng" options={options} /> */}
                    </div>
                    <DataTable columns={columns} data={dataSource?.list_insurance ?? []} />
                </>
            )}
        </div>
    )
}

export default MyInsuranceTable
