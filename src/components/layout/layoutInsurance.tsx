import React, { ReactNode } from 'react'
import Header from 'components/screens/HomePage/Header'
import Breadcrumbs from './Breadcrumbs'
import { useTranslation } from 'next-i18next'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'

interface layoutInsurance {
    children: ReactNode
}

const LayoutInsurance = ({ children }: layoutInsurance) => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    return !isMobile ? (
        <div>
            <Header />
            <Breadcrumbs>{[`${t('insurance:buy:home')}`, `${t('insurance:buy:buy_covered')}`]}</Breadcrumbs>
            {children}
        </div>
    ) : (
        <div>{children}</div>
    )
}

export default LayoutInsurance
