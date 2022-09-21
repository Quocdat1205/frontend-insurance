import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import dynamic from 'next/dynamic'
import { isMobile } from 'react-device-detect'
import { InsuranceFormLoading } from 'components/screens/Insurance/insuranceFormLoading'
const InsuranceFrom = dynamic(() => import('components/screens/Insurance/insuranceFrom'), {
    ssr: false,
    loading: () => <InsuranceFormLoading isMobile={!isMobile} />,
})

const BuyCovered = () => {
    return <InsuranceFrom />
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'errors', 'insurance_history'])),
    },
})

export default BuyCovered
