import Header from 'components/screens/HomePage/Header'
import Footer from 'components/screens/LandingPage/Footer'
import React, { ReactNode } from 'react'
import { PORTAL_MODAL_ID } from 'utils/constants'

interface LayoutWeb3 {
    children: ReactNode
    sponsor?: boolean
    widthLayout?: boolean
}

const LayoutWeb3 = ({ children, sponsor, widthLayout = false }: LayoutWeb3) => {
    return (
        <div className="min-h-screen flex flex-col justify-between">
            <Header />
            <div className={widthLayout ? 'max-w-screen-layout m-auto' : ''}> {children}</div>
            <div id={PORTAL_MODAL_ID} />
            <Footer sponsor={sponsor} />
        </div>
    )
}

export default LayoutWeb3
