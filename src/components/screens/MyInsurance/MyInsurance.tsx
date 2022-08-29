import CardShadow from 'components/common/Card/CardShadow'
import React from 'react'
import Assets from 'components/screens/HomePage/Assets'
import MyInsuranceTable from 'components/screens/MyInsurance/MyInsuranceTable'
import Statistics from 'components/screens/MyInsurance/Statistics'

const MyInsurance = () => {
    return (
        <div className="px-10 pt-[4.25rem] max-w-screen-layout m-auto">
            <div className="flex items-center justify-between">
                <div className="text-4xl font-semibold">Hợp đồng của tôi</div>
                <div className="text-blue underline">Hướng dẫn</div>
            </div>
            <Statistics />
            <CardShadow className="mt-12 p-8">
                <MyInsuranceTable />
            </CardShadow>
            <div className="pt-12">
                <div className="text-2xl font-semibold pb-6">Các sản phẩm bảo hiểm mới nhất của Nami</div>
                <Assets />
            </div>
        </div>
    )
}

export default MyInsurance
