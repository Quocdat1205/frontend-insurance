import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
    variants?: 'outlined' | 'primary' | 'gradient' | 'not_clear'
    children: ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}

const Button = ({ variants = 'gradient', children, className, onClick, disabled }: Props) => {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-lg px-auto py-auto font-semibold max-h-[3rem]',
                {
                    'bg-gradient text-white': variants === 'gradient',
                    'border border-red text-red bg-pink': variants === 'outlined',
                    'bg-red text-white': variants === 'primary',
                    'bg-divider text-white': disabled,
                },
                className,
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
