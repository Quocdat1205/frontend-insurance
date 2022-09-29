import NoData from 'components/common/NoData/NoData'
import DataTable from 'components/common/Table/DataTable'
import useWindowSize from 'hooks/useWindowSize'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { isMobile as mobile } from 'react-device-detect'
import { API_GET_COMMISSION_HISTORY } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { UnitConfig } from 'types/types'
import { formatCurrency, formatTime } from 'utils/utils'

interface TransactionsTab {
    account: any
    unitConfig: UnitConfig
}

const TransactionsTab = ({ account, unitConfig }: TransactionsTab) => {
    const { width } = useWindowSize()
    const isMobile = (width && width <= 640) || mobile
    const [loading, setLoading] = useState<boolean>(true)
    const [filter, setFilter] = useState({
        skip: 0,
        limit: mobile ? 5 : 10,
        isAll: false,
    })
    const [dataSource, setDataSource] = useState<any>({
        count: 0,
        listHistory: [],
    })
    const firstTime = useRef<boolean>(true)
    const timer = useRef<any>(null)

    useEffect(() => {
        if (!mobile && !firstTime.current) setFilter({ ...filter, skip: 0 })
        if (firstTime.current) firstTime.current = false
    }, [])

    useEffect(() => {
        clearTimeout(timer.current)
        if (account?.myRef) {
            getData()
        } else {
            timer.current = setTimeout(() => {
                setLoading(false)
            }, 500)
        }
    }, [filter, account])

    const getData = async () => {
        setLoading(true)
        try {
            const { data } = await fetchApi({
                url: API_GET_COMMISSION_HISTORY,
                options: { method: 'GET' },
                params: {
                    myRef: 'xW4wXC',
                    ...filter,
                },
            })
            if (data) {
                const dataFiter = !isMobile || !filter.skip ? data?.listHistory : dataSource.listHistory.concat(data?.listHistory)
                setDataSource({ count: data.totalHistoryRecord, listHistory: dataFiter })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const onChangePage = (page: number) => {
        if (loading) return
        setFilter({ ...filter, skip: (page - 1) * filter.limit })
    }

    const renderType = (e: any) => {
        return e.value === 'in' ? 'Nhận hoa hồng' : 'Rút hoa hồng'
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Ngày phát sinh',
                accessor: 'createdAt',
                minWidth: 200,
                Cell: (e: any) => formatTime(e.value, 'dd.MM.yyyy'),
            },
            {
                Header: 'Loại giao dịch',
                accessor: 'type',
                minWidth: 200,
                Cell: (e: any) => renderType(e),
            },
            {
                Header: 'Số tiền',
                accessor: 'amount',
                minWidth: 200,
                Cell: (e: any) => formatCurrency(e.value, unitConfig.assetDigit ?? 2) + ` ${unitConfig.assetCode}`,
            },
            {
                Header: 'Địa chỉ ví',
                accessor: 'walletAddress',
                minWidth: 200,
                Cell: (e: any) => <div>{e.value?.length > 10 ? String(e.value).substr(0, 10) + '...' + String(e.value).substr(-4) : e.value}</div>,
            },
        ],
        [unitConfig],
    )
    return (
        <>
            <div className="text-xl font-medium mb-6">Lịch sử giao dịch</div>
            {(dataSource?.listHistory.length <= 0 || !account.address) && !loading ? (
                <NoData
                    className="py-20"
                    showButton={!account.address}
                    textContent={!account.address ? `Vui lòng kết nối ví để xem danh sách bạn bè` : 'Không có dữ liệu để hiển thị'}
                />
            ) : (
                <DataTable
                    data={dataSource?.listHistory ?? []}
                    total={dataSource?.count ?? 0}
                    limit={filter.limit}
                    skip={filter.skip}
                    columns={columns}
                    loading={loading}
                    onChangePage={onChangePage}
                />
            )}
        </>
    )
}

export default TransactionsTab
