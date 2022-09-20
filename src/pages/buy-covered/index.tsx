import InsuranceFrom from 'components/screens/Insurance/insuranceFrom'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

const BuyCovered = () => {
    return <InsuranceFrom />
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'insurance', 'errors', 'insurance_history'])),
    },
})

export default BuyCovered
