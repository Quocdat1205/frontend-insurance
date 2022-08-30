import CardShadow from 'components/common/Card/CardShadow'
import React from 'react'
import Assets from 'components/screens/HomePage/Assets'
import InsuranceHistoryTable from 'components/screens/InsuranceHistory/InsuranceHistoryTable'
import Statistics from 'components/screens/InsuranceHistory/Statistics'
import Breadcrumbs from 'components/layout/Breadcrumbs'
import LayoutWeb3 from 'components/layout/LayoutWeb3'

const InsuranceHistory = () => {
    return (
        <LayoutWeb3 sponsor={false}>
            <Breadcrumbs>
                <div>Trang chủ</div>
                <div>Mua bảo hiểm</div>
                <div>Lịch sử hợp đồng</div>
            </Breadcrumbs>
            <div className="px-10 pt-[4.25rem] max-w-screen-layout m-auto">
                <div className="flex items-center justify-between">
                    <div className="text-4xl font-semibold">Hợp đồng của tôi</div>
                    <div className="text-blue underline">Hướng dẫn</div>
                </div>
                <Statistics />
                <CardShadow className="mt-12 p-8">
                    <InsuranceHistoryTable />
                </CardShadow>
                <div className="pt-12">
                    <div className="text-2xl font-semibold pb-6">Các sản phẩm bảo hiểm mới nhất của Nami</div>
                    <Assets />
                </div>
            </div>
        </LayoutWeb3>
    )
}

export default InsuranceHistory
