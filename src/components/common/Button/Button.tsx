import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
    variants?: 'outlined' | 'primary' | 'gradient'
    children: ReactNode
    className?: string
    onClick?: () => void
}

const Button = ({ variants = 'gradient', children, className, onClick }: Props) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-semibold',
                {
                    'bg-gradient text-white': variants === 'gradient',
                    'border border-red text-red bg-pink': variants === 'outlined',
                    'bg-red text-white': variants === 'primary',
                },
                className,
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button
