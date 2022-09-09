import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import InsuranceFrom from 'pages/insuranceFrom'
import React from 'react'

const BuyCovered = () => {
    return <InsuranceFrom />
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'insurance'])),
    },
})

export default BuyCovered
