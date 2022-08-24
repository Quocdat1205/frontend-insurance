import CardShadow from 'components/common/Card/CardShadow'
import { TendencyIcon } from 'components/common/Svg/SvgIcon'
import React, { useState } from 'react'
import styled from 'styled-components'

const MyInsurance = () => {
    const [day, setDay] = useState(30)
    return (
        <div className="px-10 pt-[4.25rem] max-w-screen-layout m-auto">
            <div className="flex items-center justify-between">
                <div className="text-4xl font-semibold">Hợp đồng của tôi</div>
                <div className="text-blue underline">Hướng dẫn</div>
            </div>
            <div className="flex items-center justify-between pt-12">
                <div className="text-2xl font-medium">Thống kê bảo hiểm cá nhân</div>
                <div className="flex items-center space-x-4 text-sm">
                    <Day onClick={() => setDay(30)} active={day === 30}>
                        30 ngày
                    </Day>
                    <Day onClick={() => setDay(60)} active={day === 60}>
                        60 ngày
                    </Day>
                    <Day onClick={() => setDay(90)} active={day === 90}>
                        90 ngày
                    </Day>
                </div>
            </div>
            <div className="flex items-center flex-wrap pt-6 gap-6">
                <CardShadow className="p-6 flex flex-col space-y-4 min-w-full sm:min-w-[400px] flex-1">
                    <div className="flex items-center space-x-2">
                        <img className="min-w-6 min-h-6 h-6 w-6" src="/images/icons/ic_q_claim.png" />
                        <span>Tổng Q-Claim (USDT)</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-semibold">10,000,000.2341</span>
                        <div className="flex items-center space-x-1 text-success font-semibold">
                            <TendencyIcon />
                            <span>5.7%</span>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow className="p-6 flex flex-col space-y-4 min-w-full sm:min-w-[400px] flex-1">
                    <div className="flex items-center space-x-2">
                        <img className="min-w-6 min-h-6 h-6 w-6" src="/images/icons/ic_r_claim.png" />
                        <span>Tổng Q-Claim (USDT)</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-semibold">1,000.23%</span>
                        <div className="flex items-center space-x-1 text-success font-semibold">
                            <TendencyIcon />
                            <span>5.7%</span>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow className="p-6 flex flex-col space-y-4 min-w-full sm:min-w-[400px] flex-1">
                    <div className="flex items-center space-x-2">
                        <img className="min-w-6 min-h-6 h-6 w-6" src="/images/icons/ic_noti_active.png" />
                        <span>Tổng Q-Claim (USDT)</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-semibold">10,000,000.2341</span>
                        <div className="flex items-center space-x-1 text-success font-semibold">
                            <TendencyIcon />
                            <span>5.7%</span>
                        </div>
                    </div>
                </CardShadow>
            </div>
        </div>
    )
}

const Day = styled.div.attrs<any>(({ active }) => ({
    className: `px-6 py-2 rounded-[600px] cursor-pointer ${active ? 'bg-btnOutline text-red font-semibold  ' : 'bg-hover'}`,
}))<any>``

export default MyInsurance
