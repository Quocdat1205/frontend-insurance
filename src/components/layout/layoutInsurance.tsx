import React, { ReactNode } from 'react'
import Header from 'components/screens/HomePage/Header'
import Breadcrumbs from './Breadcrumbs'
import { useTranslation } from 'next-i18next'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'

interface layoutInsurance {
    children: ReactNode
    handleClick?: any
    hiddenHeader?: boolean
}

const LayoutInsurance = ({ children, handleClick, hiddenHeader }: layoutInsurance) => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    return !isMobile ? (
        <div className="relative" onClick={handleClick}>
            {!hiddenHeader && <Header />}
            {children}
        </div>
    ) : (
        <div className="relative">{children}</div>
    )
}

export default LayoutInsurance
