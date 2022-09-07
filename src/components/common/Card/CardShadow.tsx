import React, { ReactNode } from 'react'

interface CardShadow {
    children: ReactNode
    className?: string
    mobileNoShadow?: boolean
}

const CardShadow = ({ children, className, mobileNoShadow }: CardShadow) => {
    return <div className={`${className} ${mobileNoShadow ? 'sm:shadow-card sm:rounded-xl' : 'shadow-card rounded-xl'}  `}>{children}</div>
}

export default CardShadow
