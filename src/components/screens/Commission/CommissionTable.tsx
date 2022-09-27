import Tabs, { TabItem } from 'components/common/Tabs/Tabs'
import React, { useState } from 'react'

const tabs = {
    Friends: 'Friends',
    Transactions: 'Transactions',
    Transactions1: 'Transactions1',
}

const CommissionTable = () => {
    const [tab, setTab] = useState<String>(tabs.Friends)


    return (
        <div className="pt-[4.25rem]">
            <Tabs tab={tab}>
                <TabItem value={tabs.Friends} onClick={() => setTab(tabs.Friends)}>
                    Danh sách bạn bè
                </TabItem>
                <TabItem value={tabs.Transactions} onClick={() => setTab(tabs.Transactions)}>
                    Lịch sử giao dịch
                </TabItem>
            </Tabs>
            <div className="shadow-table rounded-xl min-h-[37rem] mt-8">
                
            </div>
        </div>
    )
}

export default CommissionTable
