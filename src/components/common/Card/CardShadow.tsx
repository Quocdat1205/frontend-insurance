import React, { ReactNode } from 'react'

interface CardShadow {
    children: ReactNode
    className?: string
}

const CardShadow = ({ children, className }: CardShadow) => {
    return <div className={`${className} shadow-card rounded-xl`}>{children}</div>
}

export default CardShadow
