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
                <div className="flex flex-col text-center font-bold ">
                    <span className="text-gradient text-4xl sm:text-[3.5rem] sm:leading-[4.25rem]">Nami Insurance </span>
                    <span className="text-4xl sm:text-[3rem] sm:leading-[4rem]">{t('common:slogan')}</span>
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
