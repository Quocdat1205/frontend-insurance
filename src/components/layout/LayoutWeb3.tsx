import Header from 'components/screens/HomePage/Header'
import Footer from 'components/screens/LandingPage/Footer'
import React, { ReactNode } from 'react'
import { PORTAL_MODAL_ID } from 'utils/constants'

interface LayoutWeb3 {
    children: ReactNode
}

const LayoutWeb3 = ({ children }: LayoutWeb3) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
            <div id={PORTAL_MODAL_ID} />
        </>
    )
}

export default LayoutWeb3
