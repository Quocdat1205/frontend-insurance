import LayoutWeb3 from 'components/layout/LayoutWeb3'
import CommissionPolicy from 'components/screens/Commission/CommissionPolicy'
import CommissionReferral from 'components/screens/Commission/CommissionReferral'
import CommissionStatistics from 'components/screens/Commission/CommissionStatistics'
import CommissionTable from 'components/screens/Commission/CommissionTable'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import { RootStore, useAppSelector } from 'redux/store'
import { API_GET_INFO_USER_COMMISSION } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { UnitConfig } from 'types/types'
import { getUnit } from 'utils/utils'

export const commissionConfig = [
    { limit: 20000, ratio: 2, condition: 'ne', label: '<$20,000', text: '02%' },
    { limit: 50000, ratio: 3, condition: 'lt', label: '$20,000 - $50,000', text: '03%' },
    { limit: 100000, ratio: 4, condition: 'lt', label: '$50,000 - $100,000', text: '04%' },
    { limit: 150000, ratio: 5, condition: 'lt', label: '$100,000 - $150,000', text: '05%' },
    { added: 50000, ratio: 1, condition: 'add', label: 'Mỗi $50,000 thêm', text: '01% đến 10% (Khoảng $400,000)' },
]

const Commission = () => {
    const account = useAppSelector((state: RootStore) => state.setting.account)
    const unitConfig: UnitConfig = useAppSelector((state: RootStore) => getUnit(state, 'USDT'))
    const [userInfo, setUserInfo] = useState<any>(null)

    useEffect(() => {
        if (account?.address) getInfo()
    }, [account])

    const getInfo = async () => {
        try {
            const { data } = await fetchApi({
                url: API_GET_INFO_USER_COMMISSION,
                options: { method: 'GET' },
                params: {
                    owner: account?.address,
                },
            })
            if (data) setUserInfo(data)
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    return (
        <LayoutWeb3 sponsor={false}>
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="pt-10 max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <CommissionReferral account={account} decimal={unitConfig?.assetDigit} commissionConfig={commissionConfig} userInfo={userInfo} />
                </div>
            </div>
            {account?.address && <CommissionStatistics account={account?.address} userInfo={userInfo} decimal={unitConfig?.assetDigit} />}
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="pt-10 max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <CommissionTable unitConfig={unitConfig} account={account} />
                </div>
            </div>
            <CommissionPolicy commissionConfig={commissionConfig} />
        </LayoutWeb3>
    )
}

export const getServerSideProps = async ({ locale }: any) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'home', 'errors'])),
        },
    }
}

export default Commission
