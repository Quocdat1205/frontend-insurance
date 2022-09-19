import { InfoCircle, TendencyIcon } from 'components/common/Svg/SvgIcon'
import styled from 'styled-components'
import React, { useEffect, useMemo, useState } from 'react'
import CardShadow from 'components/common/Card/CardShadow'
import { API_GET_INDIVIDUAL_CONTRACT } from 'services/apis'
import fetchApi from 'services/fetch-api'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { formatNumber } from 'utils/utils'
import { useTranslation } from 'next-i18next'
import Skeleton from 'components/common/Skeleton/Skeleton'
import colors from 'styles/colors'
import Tooltip from 'components/common/Tooltip/Tooltip'
import { UnitConfig } from 'types/types'

interface Statistics {
    unitConfig: UnitConfig
    hasInsurance: boolean
}
const Statistics = ({ unitConfig, hasInsurance }: Statistics) => {
    const [day, setDay] = useState(30)
    const [loading, setLoading] = useState<boolean>(hasInsurance)
    const { account } = useWeb3Wallet()
    const [dataSource, setDataSource] = useState<any>(null)
    const { t } = useTranslation()

    useEffect(() => {
        if (account && hasInsurance) getIndividualContract(30)
    }, [account, hasInsurance])

    const onChangeDay = (_day: number) => {
        if (loading) return
        getIndividualContract(_day)
        setDay(_day)
    }

    const getIndividualContract = async (_day: number) => {
        setLoading(true)
        try {
            const { data } = await fetchApi({
                url: API_GET_INDIVIDUAL_CONTRACT,
                options: { method: 'GET' },
                params: { owner: account, date: _day },
            })
            setDataSource(data)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const general = useMemo(() => {
        const q_claim_comp = dataSource?.comparative_information?.q_claim
        const q_margin_comp = dataSource?.comparative_information?.q_margin
        const sum_contract_comp = dataSource?.sum_contract?.sum_contract_compare

        const q_claim = dataSource?.lookup_information?.q_claim
        const q_margin = dataSource?.lookup_information?.q_margin
        const sum_contract = dataSource?.sum_contract?.sum_contract_lookup
        const q_claim_ratio = !q_claim ? -100 : !q_claim_comp ? 100 : (q_claim / q_claim_comp) * 100
        const r_claim_ratio = !q_margin ? -100 : !q_margin_comp ? 100 : (q_margin / q_margin_comp) * 100
        const sum_contract_ratio = !sum_contract ? -100 : !sum_contract_comp ? 100 : (sum_contract / sum_contract_comp) * 100
        return {
            q_claim: q_claim_ratio && (q_claim_comp || q_claim),
            r_claim: r_claim_ratio && (q_margin_comp || q_margin),
            sum_contract: sum_contract_ratio && (sum_contract_comp || sum_contract),
        }
    }, [dataSource])

    return (
        <>
            <div id="tour_statistics" className="flex sm:items-center flex-col sm:flex-row sm:justify-between pt-8 sm:pt-12">
                <div className="sm:text-xl font-medium">{t('insurance_history:individual_cover')}</div>
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
            <div data-tut="tour_statistics" className="flex items-center flex-wrap pt-6 sm:gap-6">
                <CardShadow
                    mobileNoShadow
                    className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1 border-b border-divider sm:border-none "
                >
                    <div className="flex items-center sm:space-x-2">
                        <img className="min-w-[36px] min-h-[36px] w-9 h-9 sm:h-6 sm:w-6" src="/images/icons/ic_q_claim.png" />
                        <div className="hidden sm:flex items-center space-x-2">
                            <span>{t('home:landing:total_q_claim')}</span>
                            <div data-tip={t('insurance:terminology:q_claim')} data-for="total-q-claim">
                                <InfoCircle size={14} color={colors.txtSecondary} />
                                <Tooltip id="total-q-claim" placement="top" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                        <div className="flex sm:hidden items-center text-sm space-x-2">
                            <span>{t('home:landing:total_q_claim')}</span>
                            <div data-tip={t('insurance:terminology:q_claim')} data-for="total-q-claim">
                                <InfoCircle size={14} color={colors.txtSecondary} />
                                <Tooltip className="max-w-[200px]" id="total-q-claim" placement="top" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div className="text-xl leading-8 sm:text-4xl font-semibold">
                                {loading ? (
                                    <Skeleton className="w-[100px] sm:w-[250px] h-8" />
                                ) : (
                                    formatNumber(dataSource?.lookup_information?.q_claim, unitConfig?.assetDigit ?? 0)
                                )}
                            </div>
                            <div className="flex items-center space-x-1  font-semibold">
                                {loading ? (
                                    <Skeleton circle className="w-3 h-3" />
                                ) : (
                                    !!general.q_claim && (
                                        <TendencyIcon down={general.q_claim <= 0} color={general.q_claim > 0 ? colors.success : colors.error} />
                                    )
                                )}
                                {loading ? (
                                    <Skeleton className="min-w-[35px] min-h-[24px]" />
                                ) : (
                                    <span className={general.q_claim > 0 ? 'text-success' : 'text-error'}>{formatNumber(general.q_claim, 2, 0, true)}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow
                    mobileNoShadow
                    className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1 border-b border-divider sm:border-none "
                >
                    <div className="flex items-center sm:space-x-2">
                        <img className="min-w-[36px] min-h-[36px] w-9 h-9 sm:h-6 sm:w-6" src="/images/icons/ic_r_claim.png" />
                        <div className="hidden sm:flex items-center space-x-2">
                            <span>R-Claim</span>
                            <div data-tip={t('insurance:terminology:r_claim')} data-for="r-claim">
                                <InfoCircle size={14} color={colors.txtSecondary} />
                                <Tooltip id="r-claim" placement="top" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                        <div className="flex sm:hidden text-sm items-center space-x-2">
                            <span>R-Claim</span>
                            <div data-tip={t('insurance:terminology:r_claim')} data-for="r-claim">
                                <InfoCircle size={14} color={colors.txtSecondary} />
                                <Tooltip className="max-w-[200px]" id="r-claim" placement="top" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            {loading ? (
                                <Skeleton className="w-[100px] sm:w-[250px] h-8" />
                            ) : (
                                <div className="text-xl leading-8 sm:text-4xl font-semibold">
                                    {dataSource ? formatNumber(dataSource?.lookup_information?.q_margin / dataSource?.lookup_information?.q_claim, 4) : 0}
                                </div>
                            )}
                            <div className="flex items-center space-x-1 text-success font-semibold">
                                {loading ? (
                                    <Skeleton circle className="w-3 h-3" />
                                ) : (
                                    !!general.r_claim && (
                                        <TendencyIcon down={general.r_claim <= 0} color={general.r_claim > 0 ? colors.success : colors.error} />
                                    )
                                )}
                                {loading ? (
                                    <Skeleton className="min-w-[35px] min-h-[24px]" />
                                ) : (
                                    <span className={general.r_claim > 0 ? 'text-success' : 'text-error'}>{formatNumber(general.r_claim, 2, 0, true)}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardShadow>
                <CardShadow mobileNoShadow className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1">
                    <div className="flex items-center sm:space-x-2">
                        <img className="min-w-[36px] min-h-[36px] w-9 h-9 sm:h-6 sm:w-6" src="/images/icons/ic_noti_active.png" />
                        <span className="hidden sm:flex">{t('insurance_history:qty_of_signed')}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                        <span className="flex sm:hidden text-sm">{t('insurance_history:qty_of_signed')}</span>
                        <div className="flex items-center justify-between w-full">
                            <div className="text-xl leading-8 sm:text-4xl font-semibold">
                                {loading ? <Skeleton className="w-[100px] sm:w-[250px] h-8" /> : formatNumber(dataSource?.sum_contract?.sum_contract_lookup, 4)}
                            </div>
                            <div className="flex items-center space-x-1 text-success font-semibold">
                                {loading ? (
                                    <Skeleton circle className="w-3 h-3" />
                                ) : (
                                    !!general.sum_contract && (
                                        <TendencyIcon down={general.sum_contract <= 0} color={general.sum_contract > 0 ? colors.success : colors.error} />
                                    )
                                )}
                                {loading ? (
                                    <Skeleton className="min-w-[35px] min-h-[24px]" />
                                ) : (
                                    <span className={general.sum_contract > 0 ? 'text-success' : 'text-error'}>
                                        {formatNumber(general.sum_contract, 2, 0, true)}%
                                    </span>
                                )}
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
