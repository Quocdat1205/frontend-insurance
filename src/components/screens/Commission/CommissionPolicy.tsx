import React from 'react'
import styled from 'styled-components'

interface CommissionPolicy {
    commissionConfig: any[]
}

const CommissionPolicy = ({ commissionConfig }: CommissionPolicy) => {
    return (
        <Background className="">
            <div className="text-2xl sm:text-5xl font-semibold text-center">Chính sách hoa hồng</div>
            <div className="text-sm sm:text-base max-w-[780px] text-center mt-4">
                Với mỗi hợp đồng ký quỹ bảo hiểm (HĐBH) phát sinh từ người dùng do Đối tác kinh doanh giới thiệu, Đối tác kinh doanh sẽ nhận được mức hoa hồng
                tương ứng với tổng margin tích luỹ như sau:
            </div>
            <div className="border border-red rounded-xl mt-10 sm:mt-12 w-full sm:w-max">
                <div className="bg-pink-2 text-red font-semibold flex items-center rounded-t-xl">
                    <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[237px] rounded-t-xl">Tổng Margin tích luỹ</div>
                    <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[359px] rounded-tr-xl">Mức hoa hồng trên HĐBH</div>
                </div>
                <div className="flex flex-col divide-y divide-divider border-t border-divider">
                    {commissionConfig.map((item: any, index: number) => (
                        <div key={index} className="flex items-center">
                            <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[237px]">{item?.label}</div>
                            <div className="px-4 pt-6 pb-4 sm:pl-12 sm:pr-6 sm:py-6 w-1/2 sm:min-w-[359px]">{item?.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Background>
    )
}

const Background = styled.div.attrs<any>({
    className: 'mt-12 sm:mt-[4.375rem] py-10 sm:py-[4.375rem] flex flex-col items-center justify-center px-4 mb:px-10 lg:px-20',
})`
    background-image: ${() => `url(${`/images/screens/commission/bg_commission_policy.png`})`};
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
`

export default CommissionPolicy
