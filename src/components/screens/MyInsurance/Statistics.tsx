import { TendencyIcon } from 'components/common/Svg/SvgIcon'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import CardShadow from 'components/common/Card/CardShadow'
import { API_GET_INDIVIDUAL_CONTRACT } from 'services/apis'
import fetchApi from 'services/fetch-api'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { formatNumber } from 'utils/utils'

const Statistics = () => {
    const [day, setDay] = useState(30)
    const [loading, setLoading] = useState<boolean>(false)
    const { account } = useWeb3Wallet()
    const [dataSource, setDataSource] = useState<any>(null)

    useEffect(() => {
        if (account) getIndividualContract(30)
    }, [account])

    const onChangeDay = (_day: number) => {
        if (loading) return
        getIndividualContract(_day)
        setDay(_day)
    }
    
    const getIndividualContract = async (_day: number) => {
        setLoading(true)
        try {
            const { data, message } = await fetchApi({
                url: API_GET_INDIVIDUAL_CONTRACT,
                options: { method: 'GET' },
                params: { walletAddress: account, day: _day },
            })
            setDataSource(data)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between pt-12">
                <div className="text-2xl font-medium">Thống kê bảo hiểm cá nhân</div>
                <div className="flex items-center space-x-4 text-sm">
                    <Day onClick={() => onChangeDay(30)} active={day === 30}>
                        30 ngày
                    </Day>
                    <Day onClick={() => onChangeDay(60)} active={day === 60}>
                        60 ngày
                    </Day>
                    <Day onClick={() => onChangeDay(90)} active={day === 90}>
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
                        <span className="text-4xl font-semibold">{formatNumber(dataSource?.q_claim, 4)}</span>
                        <div className="flex items-center space-x-1 text-success font-semibold">
                            <TendencyIcon />
                            <span>5.7%</span>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow className="p-6 flex flex-col space-y-4 min-w-full sm:min-w-[400px] flex-1">
                    <div className="flex items-center space-x-2">
                        <img className="min-w-6 min-h-6 h-6 w-6" src="/images/icons/ic_r_claim.png" />
                        <span>R-Claim</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-semibold">{dataSource ? formatNumber(dataSource?.q_margin / dataSource?.q_claim, 4) : 0}</span>
                        <div className="flex items-center space-x-1 text-success font-semibold">
                            <TendencyIcon />
                            <span>5.7%</span>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow className="p-6 flex flex-col space-y-4 min-w-full sm:min-w-[400px] flex-1">
                    <div className="flex items-center space-x-2">
                        <img className="min-w-6 min-h-6 h-6 w-6" src="/images/icons/ic_noti_active.png" />
                        <span>Số hợp đồng đã ký</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-semibold">{formatNumber(dataSource?.q_contract, 4)}</span>
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

export default Statistics
