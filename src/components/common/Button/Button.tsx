import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
    variants?: 'outlined' | 'primary' | 'gradient'
    children: ReactNode
    className?: string
    onClick?: () => void
    disable?: boolean
}

const Button = ({ variants = 'gradient', children, className, onClick, disable }: Props) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-semibold',
                {
                    'bg-gradient text-white': variants === 'gradient',
                    'border border-red text-red bg-pink': variants === 'outlined',
                },
                className,
            )}
            onClick={onClick}
            disabled={disable}
        >
            {children}
        </button>
    )
}

export default Button
