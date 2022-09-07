import { TendencyIcon } from 'components/common/Svg/SvgIcon'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import CardShadow from 'components/common/Card/CardShadow'
import { API_GET_INDIVIDUAL_CONTRACT } from 'services/apis'
import fetchApi from 'services/fetch-api'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { formatNumber } from 'utils/utils'
import { useTranslation } from 'next-i18next'

const Statistics = () => {
    const [day, setDay] = useState(30)
    const [loading, setLoading] = useState<boolean>(false)
    const { account } = useWeb3Wallet()
    const [dataSource, setDataSource] = useState<any>(null)
    const { t } = useTranslation()

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
        <>
            <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between pt-8 sm:pt-12">
                <div className="sm:text-2xl font-medium">{t('insurance_history:individual_cover')}</div>
                <div className="flex items-center space-x-3 sm:space-x-4 text-sm mt-4 sm:mt-0">
                    <Day onClick={() => onChangeDay(30)} active={day === 30}>
                        30 {t('common:days')}
                    </Day>
                    <Day onClick={() => onChangeDay(60)} active={day === 60}>
                        60 {t('common:days')}
                    </Day>
                    <Day onClick={() => onChangeDay(90)} active={day === 90}>
                        90 {t('common:days')}
                    </Day>
                </div>
            </div>
            <div className="flex items-center flex-wrap pt-6 sm:gap-6">
                <CardShadow
                    mobileNoShadow
                    className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 min-w-full sm:min-w-[400px] flex-1 border-b border-divider sm:border-none "
                >
                    <div className="flex items-center sm:space-x-2">
                        <img className="min-w-[36px] min-h-[36px] w-9 h-9 sm:h-6 sm:w-6" src="/images/icons/ic_q_claim.png" />
                        <span className="hidden sm:flex">{t('home:landing:total_q_claim')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                        <span className="flex sm:hidden text-sm">{t('home:landing:total_q_claim')}</span>
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xl leading-8 sm:text-4xl font-semibold">{formatNumber(dataSource?.q_claim, 4)}</span>
                            <div className="flex items-center space-x-1 text-success font-semibold">
                                <TendencyIcon />
                                <span>5.7%</span>
                            </div>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow
                    mobileNoShadow
                    className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 min-w-full sm:min-w-[400px] flex-1 border-b border-divider sm:border-none "
                >
                    <div className="flex items-center sm:space-x-2">
                        <img className="min-w-[36px] min-h-[36px] w-9 h-9 sm:h-6 sm:w-6" src="/images/icons/ic_q_claim.png" />
                        <span className="hidden sm:flex">R-Claim</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                        <span className="flex sm:hidden text-sm">R-Claim</span>
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xl leading-8 sm:text-4xl font-semibold">
                                {dataSource ? formatNumber(dataSource?.q_margin / dataSource?.q_claim, 4) : 0}
                            </span>
                            <div className="flex items-center space-x-1 text-success font-semibold">
                                <TendencyIcon />
                                <span>5.7%</span>
                            </div>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow mobileNoShadow className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 min-w-full sm:min-w-[400px] flex-1">
                    <div className="flex items-center sm:space-x-2">
                        <img className="min-w-[36px] min-h-[36px] w-9 h-9 sm:h-6 sm:w-6" src="/images/icons/ic_q_claim.png" />
                        <span className="hidden sm:flex">{t('insurance_history:qty_of_signed')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                        <span className="flex sm:hidden text-sm">{t('insurance_history:qty_of_signed')}</span>
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xl leading-8 sm:text-4xl font-semibold">{formatNumber(dataSource?.q_contract, 4)}</span>
                            <div className="flex items-center space-x-1 text-success font-semibold">
                                <TendencyIcon />
                                <span>5.7%</span>
                            </div>
                        </div>
                    </div>
                </CardShadow>
            </div>
        </>
    )
}

const Day = styled.div.attrs<any>(({ active }) => ({
    className: `px-6 py-2 rounded-[600px] cursor-pointer whitespace-nowrap w-full sm:w-max text-center lowercase ${
        active ? 'bg-btnOutline text-red font-semibold  ' : 'bg-hover'
    }`,
}))<any>``

export default Statistics
