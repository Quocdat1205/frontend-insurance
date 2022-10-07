import Spinner from 'components/common/Loader/Spinner'
import NoData from 'components/common/NoData/NoData'
import DataTable from 'components/common/Table/DataTable'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { isMobile as mobile } from 'react-device-detect'
import { API_GET_COMMISSION_HISTORY } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { UnitConfig } from 'types/types'
import { formatAddress, formatCurrency, formatTime } from 'utils/utils'

// change this to mainnet on prod
const network = 'https://testnet.bscscan.com/address'
const genAddressLink = (address: string) => `${network}/${address}#tokentxns`
interface TransactionsTab {
    account: any
    unitConfig: UnitConfig
    doReload: boolean
}

const TransactionsTab = ({ account, unitConfig, doReload }: TransactionsTab) => {
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
    }, [filter, account, doReload])

    const getData = async () => {
        setLoading(true)
        try {
            const { data } = await fetchApi({
                url: API_GET_COMMISSION_HISTORY,
                options: { method: 'GET' },
                params: {
                    myRef: account.myRef,
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

    const renderType = ({ type }: any) => {
        return type === 'in' ? t('commission:history:receive_reward') : t('commission:history:withdraw_reward')
    }

    const addressTypes: any = {
        in: t('common:from'),
        out: t('common:to'),
    }

    const columns = useMemo(
        () => [
            {
                Header: t('common:date'),
                accessor: 'createdAt',
                minWidth: 200,
                Cell: (e: any) => formatTime(e.value, 'dd.MM.yyyy hh:mm'),
            },
            {
                Header: t('common:type'),
                accessor: 'type',
                minWidth: 200,
                Cell: (e: any) => renderType(e?.row?.original),
            },
            {
                Header: t('common:amount'),
                accessor: 'amount',
                minWidth: 200,
                Cell: (e: any) => formatCurrency(e.value, unitConfig.assetDigit ?? 2) + ` ${unitConfig.assetCode}`,
            },
            {
                Header: t('common:address_wallet'),
                accessor: 'walletAddress',
                minWidth: 200,
                Cell: (e: any) => (
                    <a href={genAddressLink(e.value)} className="cursor-pointer hover:text-red-2 hover:underline" target="_blank">
                        {addressTypes[e?.row?.original.type]} {formatAddress(e.value)}
                    </a>
                ),
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
            <div className="text-xl font-medium mb-6 hidden sm:flex">Lịch sử giao dịch</div>
            {(dataSource?.listHistory.length <= 0 || !account.address) && !loading ? (
                <NoData
                    className="py-20"
                    showButton={!account.address}
                    textContent={!account.address ? t('commisson:history:commission_history_nodata') : 'Không có dữ liệu để hiển thị'}
                    onClick={() => Config.connectWallet()}
                />
            ) : !isMobile ? (
                <DataTable
                    data={dataSource?.listHistory ?? []}
                    total={dataSource?.count ?? 0}
                    limit={filter.limit}
                    skip={filter.skip}
                    columns={columns}
                    loading={loading}
                    onChangePage={onChangePage}
                />
            ) : (
                <div className="flex flex-col space-y-6">
                    {dataSource?.listHistory?.map((item: any, index: number) => {
                        return (
                            <div key={index} className="rounded-xl bg-hover p-4">
                                <div className="font-medium">
                                    {t('common:date')}: {formatTime(item?.createdAt, 'dd.MM.yyyy')}
                                </div>
                                <div className="flex flex-col text-sm w-full divide-y divide-divider mt-6">
                                    <div className="flex items-center pb-2 justify-between">
                                        <div className="text-txtSecondary">{t('common:type')}</div>
                                        <div className="font-semibold">{renderType(item)}</div>
                                    </div>
                                    <div className="flex items-center py-2 justify-between">
                                        <div className="text-txtSecondary">{t('common:amount')}</div>
                                        <div className="font-semibold">
                                            {formatCurrency(item?.amount, unitConfig.assetDigit ?? 2) + ` ${unitConfig.assetCode}`}
                                        </div>
                                    </div>
                                    <div className="flex items-center py-2 justify-between">
                                        <div className="text-txtSecondary">{t('common:address_wallet')}</div>
                                        <div className="font-semibold">
                                            {item?.type === 'in' ? t('common:from') : t('common:to')}&nbsp;
                                            {formatAddress(item?.walletAddress)}
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

export default TransactionsTab
