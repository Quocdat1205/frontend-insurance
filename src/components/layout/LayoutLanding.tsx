import React from 'react'
import HeaderLanding from 'components/screens/LandingPage/HeaderLanding'
import Footer from 'components/screens/LandingPage/Footer'
import { PORTAL_MODAL_ID } from 'utils/constants'

function LayoutLanding({ children }: any) {
    return (
        <>
            <HeaderLanding />
            {children}
            <Footer/>
            <div id={PORTAL_MODAL_ID} />
        </>
    )
}

export default LayoutLanding
