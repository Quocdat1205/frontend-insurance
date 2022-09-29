import NoData from 'components/common/NoData/NoData'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_GET_FRIENDS } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { isMobile as mobile } from 'react-device-detect'
import DataTable from 'components/common/Table/DataTable'
import useWindowSize from 'hooks/useWindowSize'
import { formatCurrency, formatTime } from 'utils/utils'
import { UnitConfig } from 'types/types'

interface FriendsTab {
    account: any
    setFriends: (e: any) => void
    unitConfig: UnitConfig
}

const FriendsTab = ({ account, setFriends, unitConfig }: FriendsTab) => {
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
        listFriends: [],
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
                url: API_GET_FRIENDS,
                options: { method: 'GET' },
                params: {
                    myRef: 'xW4wXC',
                    ...filter,
                },
            })
            if (data) {
                const dataFiter = !isMobile || !filter.skip ? data?.listFriends : dataSource.listFriends.concat(data?.listFriends)
                setFriends({ total: data?.totalFriends, totalDeposit: data?.totalFriendDeposited })
                setDataSource({ count: data.totalFriends, listFriends: dataFiter })
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

    const columns = useMemo(
        () => [
            {
                Header: 'Địa chỉ ví',
                accessor: 'child',
                minWidth: 200,
                Cell: (e: any) => <div>{e.value?.length > 10 ? String(e.value).substr(0, 10) + '...' + String(e.value).substr(-4) : e.value}</div>,
            },
            {
                Header: 'Thời gian gắn',
                accessor: 'createdAt',
                minWidth: 200,
                Cell: (e: any) => formatTime(e.value, 'dd.MM.yyyy'),
            },
            {
                Header: 'Tổng HĐBH',
                accessor: 'totalInsurance',
                minWidth: 200,
                Cell: (e: any) => formatCurrency(e.value),
            },
            {
                Header: 'Tổng margin',
                accessor: 'totalMargin',
                minWidth: 200,
                Cell: (e: any) => formatCurrency(e.value, unitConfig.assetDigit ?? 2) + ` ${unitConfig.assetCode}`,
            },
            {
                Header: 'Tổng hoa hồng',
                accessor: 'totalCommission',
                minWidth: 200,
                Cell: (e: any) => formatCurrency(e.value, unitConfig.assetDigit ?? 2) + ` ${unitConfig.assetCode}`,
            },
        ],
        [unitConfig],
    )

    return (
        <>
            <div className="text-xl font-medium mb-6">Danh sách bạn bè</div>
            {(dataSource.listFriends.length <= 0 || !account.address) && !loading ? (
                <NoData
                    className="py-20"
                    showButton={!account.address}
                    textContent={!account.address ? `Vui lòng kết nối ví để xem danh sách bạn bè` : 'Không có dữ liệu để hiển thị'}
                />
            ) : (
                <DataTable
                    data={dataSource?.listFriends ?? []}
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

export default FriendsTab
