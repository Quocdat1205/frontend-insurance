import React from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'

interface Progressbar {
    color?: string
    height?: number
    percent?: number
    className?: string
}

const Progressbar = ({ color = colors.red.red, height = 10, percent = 0, className = '' }: Progressbar) => {
    return (
        <div className={`w-full bg-white rounded-[3px] ${className}`}>
            <Progress color={color} height={height} percent={percent}></Progress>
        </div>
    )
}

export const Progress = styled.div.attrs<Progressbar>(() => ({
    className: `rounded-lg transition-all`,
}))<Progressbar>`
    background: ${({ color }) => (color ? color : colors.red.red)};
    width: ${({ percent = 0 }) => `${percent > 100 ? 100 : percent}%`};
    height: ${({ height }) => `${height}px`};
`

export default Progressbar
