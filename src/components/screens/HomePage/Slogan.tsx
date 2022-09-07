import Button from 'components/common/Button/Button'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import React from 'react'
import styled from 'styled-components'

const Slogan = () => {
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < 640 ? true : false
    return (
        <Background isMobile={isMobile}>
            <div className="flex flex-col items-center space-y-6 w-full">
                <div className="flex flex-col text-[2rem] text-center lg:text-[3rem] font-bold sm:font-semibold whitespace-nowrap leading-[2.625rem] sm:leading-[3.875rem]">
                    <span>Đây là slogan </span>
                    <span className="text-gradient">của Nami Insurance</span>
                </div>
            </div>
        </Background>
    )
}

interface Slogan {
    isMobile: boolean
}

const Background = styled.section.attrs<any>({
    className: 'px-4 pt-[4.25rem] pb-20',
})<Slogan>`
    background-image: ${({ isMobile }) => `url(${`/images/screens/home/bg_slogan${isMobile ? '_mobile' : ''}.png`})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
`

export default Slogan
