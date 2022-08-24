import LayoutWeb3 from 'components/layout/LayoutWeb3'
import React from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Breadcrumbs from 'components/layout/Breadcrumbs'
import MyInsurance from 'components/screens/MyInsurance/MyInsurance'

const Myinsurance = () => {
    return (
        <LayoutWeb3 sponsor={false}>
            <Breadcrumbs>
                <div>Trang chủ</div>
                <div>Mua bảo hiểm</div>
                <div>Lịch sử hợp đồng</div>
            </Breadcrumbs>
            <MyInsurance />
        </LayoutWeb3>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'insurance'])),
    },
})
export default Myinsurance
