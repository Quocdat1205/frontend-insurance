import CardShadow from 'components/common/Card/CardShadow'
import React from 'react'
import Assets from 'components/screens/HomePage/Assets'
import InsuranceContract from 'components/screens/InsuranceHistory/InsuranceContract'
import Statistics from 'components/screens/InsuranceHistory/Statistics'
import Breadcrumbs from 'components/layout/Breadcrumbs'
import LayoutWeb3 from 'components/layout/LayoutWeb3'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useTranslation } from 'next-i18next'

const InsuranceHistory = () => {
    const { account } = useWeb3Wallet()
    const { t } = useTranslation()

    return (
        <LayoutWeb3 sponsor={false}>
            <Breadcrumbs>
                <div>{t('common:header:home')}</div>
                <div>{t('common:header:buy_covered')}</div>
                <div>{t('common:header:insurance_history')}</div>
            </Breadcrumbs>
            <div className="px-4 sm:px-10 pt-12 sm:pt-[4.25rem] max-w-screen-layout m-auto">
                <div className="flex items-center justify-between">
                    <div className="text-2xl sm:text-4xl font-semibold">{t('insurance_history:my_cover')}</div>
                    <div className="text-sm sm:text-base text-blue underline">{t('insurance_history:guidelines')}</div>
                </div>
                {account && <Statistics />}
                <CardShadow mobileNoShadow className="sm:mt-12 sm:p-8">
                    <InsuranceContract account={account} />
                </CardShadow>
                <div className="pt-[30px] sm:pt-12">
                    <div className="sm:text-2xl font-semibold pb-6">{t('insurance_history:new_cover_assets')}</div>
                    <Assets />
                </div>
            </div>
        </LayoutWeb3>
    )
}

export default InsuranceHistory
