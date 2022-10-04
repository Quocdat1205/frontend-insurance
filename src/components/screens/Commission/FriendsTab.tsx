import NoData from 'components/common/NoData/NoData'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { API_GET_FRIENDS } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { isMobile as mobile } from 'react-device-detect'
import DataTable from 'components/common/Table/DataTable'
import useWindowSize from 'hooks/useWindowSize'
import { formatAddress, formatCurrency, formatTime } from 'utils/utils'
import { UnitConfig } from 'types/types'
import Spinner from 'components/common/Loader/Spinner'
import { useTranslation } from 'next-i18next'

interface FriendsTab {
    account: any
    setFriends: (e: any) => void
    unitConfig: UnitConfig,
    doReload: boolean
}

const FriendsTab = ({ account, setFriends, unitConfig, doReload }: FriendsTab) => {
    const { t } = useTranslation()
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
    }, [filter, account, doReload])

    const getData = async () => {
        setLoading(true)
        try {
            const { data } = await fetchApi({
                url: API_GET_FRIENDS,
                options: { method: 'GET' },
                params: {
                    myRef: account.myRef,
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
                Cell: (e: any) => <div>{formatAddress(e.value)}</div>,
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

    const totalPage = useMemo(() => {
        return Math.ceil(dataSource?.count / filter?.limit)
    }, [dataSource?.count, filter])

    const hasNext = useMemo(() => {
        return Math.ceil(filter.skip / filter?.limit) + 1 < totalPage || loading
    }, [filter, totalPage, loading])

    const onLoadMore = () => {
        if (loading) return
        setLoading(true)
        setFilter({ ...filter, skip: filter.limit + filter.skip })
    }

    return (
        <>
            <div className="text-xl font-medium mb-6 hidden sm:flex">Danh sách bạn bè</div>
            {(dataSource.listFriends.length <= 0 || !account.address) && !loading ? (
                <NoData
                    className="py-20"
                    showButton={!account.address}
                    textContent={!account.address ? `Vui lòng kết nối ví để xem danh sách bạn bè` : 'Không có dữ liệu để hiển thị'}
                />
            ) : !isMobile ? (
                <DataTable
                    data={dataSource?.listFriends ?? []}
                    total={dataSource?.count ?? 0}
                    limit={filter.limit}
                    skip={filter.skip}
                    columns={columns}
                    loading={loading}
                    onChangePage={onChangePage}
                />
            ) : (
                <div className="flex flex-col space-y-6">
                    {dataSource?.listFriends?.map((item: any, index: number) => {
                        return (
                            <div key={index} className="rounded-xl bg-hover p-4">
                                <div className="font-medium">Ví: {formatAddress(item.child)}</div>
                                <div className="flex flex-col text-sm w-full divide-y divide-divider mt-6">
                                    <div className="flex items-center pb-2 justify-between">
                                        <div className="text-txtSecondary">Thời gian gắn</div>
                                        <div className="font-semibold">{formatTime(item.createdAt, 'dd.MM.yyyy')}</div>
                                    </div>
                                    <div className="flex items-center py-2 justify-between">
                                        <div className="text-txtSecondary">Tổng HĐBH</div>
                                        <div className="font-semibold">{formatCurrency(item.totalInsurance)}</div>
                                    </div>
                                    <div className="flex items-center py-2 justify-between">
                                        <div className="text-txtSecondary">Tổng margin</div>
                                        <div className="font-semibold">
                                            {formatCurrency(item.totalMargin, unitConfig.assetDigit ?? 2)} {unitConfig.assetCode}
                                        </div>
                                    </div>
                                    <div className="flex items-center pt-2 justify-between">
                                        <div className="text-txtSecondary">Tổng hoa hồng</div>
                                        <div className="font-semibold">
                                            {formatCurrency(item.totalCommission, unitConfig.assetDigit ?? 2)} {unitConfig.assetCode}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {totalPage > 1 && hasNext && (
                        <div onClick={onLoadMore} className="text-red underline text-sm mt-6 flex text-center justify-center cursor-pointer">
                            {loading ? <Spinner /> : t('common:load_more')}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default FriendsTab
