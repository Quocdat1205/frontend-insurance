import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'
import dynamic from 'next/dynamic'
const InsuranceFrom = dynamic(() => import('components/screens/Insurance/InsuranceFrom'), {
    ssr: true,
})

const BuyCovered = () => {
    return <InsuranceFrom></InsuranceFrom>
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'errors', 'insurance_history'])),
    },
})

export default BuyCovered
