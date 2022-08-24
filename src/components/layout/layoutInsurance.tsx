import React, { ReactNode } from 'react'
import Header from 'components/screens/HomePage/Header'

interface layoutInsurance {
    children: ReactNode
}

const LayoutInsurance = ({ children }: layoutInsurance) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default LayoutInsurance
