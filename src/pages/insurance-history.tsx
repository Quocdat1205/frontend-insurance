import LayoutWeb3 from 'components/layout/LayoutWeb3'
import React from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Breadcrumbs from 'components/layout/Breadcrumbs'
import InsuranceHistory from 'components/screens/InsuranceHistory/InsuranceHistory'
import { useTranslation } from 'next-i18next'

const Myinsurance = () => {
    const { t } = useTranslation()
    return (
        <LayoutWeb3 sponsor={false}>
            <Breadcrumbs>
                <div>{t('home:header:home')}</div>
                <div>{t('home:header:buy_covered')}</div>
                <div>{t('home:header:insurance_history')}</div>
            </Breadcrumbs>
            <InsuranceHistory />
        </LayoutWeb3>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'insurance'])),
    },
})
export default Myinsurance
