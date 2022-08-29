import React, { useEffect } from 'react'
import HeaderLanding from 'components/screens/LandingPage/HeaderLanding'
import Footer from 'components/screens/LandingPage/Footer'
import { PORTAL_MODAL_ID } from 'utils/constants'

function LayoutLanding({ children }: any) {
    useEffect(() => {
        let vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
        let vw = window.innerWidth
        if (vw <= 360) {
            document.documentElement.style.setProperty('font-size', '14px')
        }
    }, [])

    return (
        <>
            <HeaderLanding />
            {children}
            <Footer />
            <div id={PORTAL_MODAL_ID} />
        </>
    )
}

export default LayoutLanding
