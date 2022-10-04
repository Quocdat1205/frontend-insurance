import Tabs, { TabItem } from 'components/common/Tabs/Tabs'
import React, { useEffect, useState } from 'react'
import TransactionsTab from './TransactionsTab'
import { formatNumber } from 'utils/utils'
import { UnitConfig } from 'types/types'
import dynamic from 'next/dynamic'
const FriendsTab = dynamic(() => import('components/screens/Commission/FriendsTab'), {
    ssr: false,
})

const tabs = {
    Friends: 'Friends',
    Transactions: 'Transactions',
}

interface CommissionTable {
    account: any
    unitConfig: UnitConfig
    doReload: boolean
}

const CommissionTable = ({ account, unitConfig, doReload }: CommissionTable) => {
    const [tab, setTab] = useState<String>(tabs.Friends)
    const [friends, setFriends] = useState({ total: 0, totalDeposit: 0 })

    useEffect(() => {
        setFriends({ total: 0, totalDeposit: 0 })
    }, [tab])

    return (
        <div>
            <Tabs tab={tab}>
                <TabItem value={tabs.Friends} onClick={() => setTab(tabs.Friends)}>
                    Danh sách bạn bè
                </TabItem>
                <TabItem value={tabs.Transactions} onClick={() => setTab(tabs.Transactions)}>
                    Lịch sử giao dịch
                </TabItem>
            </Tabs>
            <div className="font-semibold mt-6 flex sm:hidden">{tabs.Friends === tab ? 'Danh sách bạn bè' : 'Lịch sử giao dịch'}</div>
            {tabs.Friends === tab && account?.address && (
                <div className="mt-6 flex flex-col sm:flex-row items-center">
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl w-full">
                        <img src="/images/icons/ic_group.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_group.png" className="w-6 h-6 sm:flex hidden" />
                                <span>Tổng số bạn bè</span>
                            </div>
                            <div className="text-xl sm:text-2xl mt-3 sm:mt-4 font-semibold sm:font-medium">{formatNumber(friends.total, 0)} người</div>
                        </div>
                    </div>
                    <div className="flex items-center shadow-table p-4 sm:p-6 bg-white rounded-xl mt-4 sm:mt-0 ml-0 sm:ml-6 w-full">
                        <img src="/images/icons/ic_margin.png" className="w-9 h-9 flex sm:hidden mr-4" />
                        <div className="flex flex-col w-full">
                            <div className="flex items-center sm:space-x-2 text-sm sm:text-base">
                                <img src="/images/icons/ic_margin.png" className="w-6 h-6 sm:flex hidden" />
                                <span>Tổng số bạn bè đã ký quỹ HĐBH</span>
                            </div>
                            <div className="text-xl sm:text-2xl mt-3 sm:mt-4 font-semibold sm:font-medium">{formatNumber(friends.totalDeposit, 0)} người</div>
                        </div>
                    </div>
                </div>
            )}
            <div className="sm:shadow-table sm:rounded-xl mt-6 sm:p-8">
                {tabs.Friends === tab && <FriendsTab unitConfig={unitConfig} account={account} setFriends={setFriends} doReload={doReload} />}
                {tabs.Transactions === tab && <TransactionsTab unitConfig={unitConfig} account={account} doReload={doReload} />}
            </div>
        </div>
    )
}

export default CommissionTable
