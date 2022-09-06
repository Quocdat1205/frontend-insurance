import React, { ReactNode } from 'react'
import Header from 'components/screens/HomePage/Header'
import Breadcrumbs from './Breadcrumbs'
import { useTranslation } from 'next-i18next'

interface layoutInsurance {
    children: ReactNode
}

const LayoutInsurance = ({ children }: layoutInsurance) => {
    const { t } = useTranslation()
    return (
        <div>
            <Header />
            <Breadcrumbs>{[`${t('insurance:buy:home')}`, `${t('insurance:buy:buy_covered')}`]}</Breadcrumbs>
            {children}
        </div>
    )
}

export default LayoutInsurance
