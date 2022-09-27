import LayoutWeb3 from 'components/layout/LayoutWeb3'
import CommissionReferral from 'components/screens/Commission/CommissionReferral'
import CommissionTable from 'components/screens/Commission/CommissionTable'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React from 'react'

const Commission = () => {
    return (
        <LayoutWeb3 sponsor={false}>
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="pt-10 max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <CommissionReferral />
                    <CommissionTable />
                </div>
            </div>
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
