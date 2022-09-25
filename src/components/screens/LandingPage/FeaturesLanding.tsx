import AOS from 'aos'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import 'aos/dist/aos.css'
import { RightArrow } from 'components/common/Svg/SvgIcon'
import { DURATION_AOS } from 'utils/constants'
import { useRouter } from 'next/router'

//
const LAST_INDEX = 2

const FeaturesLanding = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const features = [
        {
            img: '/images/screens/landing-page/bg_asset_insurance.png',
            title: t('home:landing:asset_value'),
            content: t('home:landing:asset_value_content'),
        },
        {
            img: '/images/screens/landing-page/bg_asset_support.png',
            title: t('home:landing:multi_asset'),
            content: t('home:landing:multi_asset_content'),
        },
        {
            img: '/images/screens/landing-page/bg_asset_demand.png',
            title: t('home:landing:insurance_options'),
            content: t('home:landing:insurance_options_content'),
        },
    ]

    useEffect(() => {
        AOS.init()
        AOS.refresh()
    }, [])

    const handleOnBuyCover = () => {
        router.push('/buy-covered')
    }

    return (
        <section className="px-4 lg:px-20">
            <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto text-center flex flex-col justify-center items-center pt-20 sm:pt-[7.5rem]">
                <div className="text-2xl sm:text-5xl leading-8 font-semibold mb-4">{t('home:landing:unique_features')}</div>
                <div className="max-w-[632px] text-[0.875rem] lg:text-[1rem]">{t('home:landing:unique_features_content')}</div>
                <div className="flex flex-wrap space-y-6 w-full sm:space-y-0 sm:gap-6 mt-7 sm:mt-9">
                    {features.map((item: any, index: number) => {
                        // break for last case -- use flex box to handle below
                        if (index === 2) return null
                        return (
                            <div key={item.img} className={'bg-hover flex flex-col flex-1 rounded-xl w-[calc(100%/2-24px)] h-full min-w-[310px]'}>
                                <Container
                                    data-aos="fade-up"
                                    data-aos-delay={DURATION_AOS * index}
                                    className={'flex'}
                                    img={item.img}
                                    last={LAST_INDEX === index}
                                >
                                    <Item key={index}>
                                        <div className="flex flex-col h-full justify-start h-full lg:justify-between items-start p-6">
                                            <div className={'sm:mt-9 text-left max-w-[370px] mb-6 sm:bm-0'}>
                                                <div className="text-xl lg:text-2xl font-medium text-red mb-2">{item.title}</div>
                                                <div className="text-sm lg:text-base">{item.content}</div>
                                            </div>
                                            <p onClick={handleOnBuyCover} className={'text-red text-sm lg:text-base font-semibold cursor-pointer'}>
                                                {t('common:header:buy_covered')} <RightArrow className={'inline-block'} color={'red'} />{' '}
                                            </p>
                                        </div>
                                    </Item>
                                </Container>
                            </div>
                        )
                    })}

                    {/* Use FlexBox instead grid to prevent image scale error --- image t0o large */}
                    <div className="rounded-xl bg-hover flex flex-col w-full lg:flex-row h-full justify-start h-full lg:justify-between items-start">
                        <div className={'flex-1 w-full h-full flex flex-col items-start justify-between lg:min-h-[360px] lg:max-w-[600px] p-6'}>
                            <div className={'sm:mt-9 text-left max-w-[370px] mb-6 sm:bm-0'}>
                                <div className="text-xl lg:text-2xl font-medium text-red mb-2">{features[2].title}</div>
                                <div className="text-sm lg:text-base">{features[2].content}</div>
                            </div>
                            <p onClick={handleOnBuyCover} className={'text-red text-sm lg:text-base font-semibold cursor-pointer'}>
                                {t('common:header:buy_covered')} <RightArrow className={'inline-block'} color={'red'} />{' '}
                            </p>
                        </div>
                        <DemandImage img={features[2].img}></DemandImage>
                    </div>
                </div>
            </div>
        </section>
    )
}

const DemandImage = styled.div.attrs({
    className:
        'w-full flex bg-contain lg:pt-0 pt-2 bg-no-repeat lg:bg-cover rounded-b-xl lg:rounded-r-md ' +
        'min-h-[200px] min-w-screen max-h-[277px] mt-[3.625rem] lg:mt-0 lg:min-h-[360px] lg:max-w-[600px] ',
})<any>`
    background-image: ${({ img }) => `url(${img})`};
    background-repeat: no-repeat;
    background-size: 100% 100%;

    object-fit: contain;
`

const Container = styled.div.attrs({})<any>`
    background-image: ${({ img }) => `url(${img})`};
    border-radius: 12px;
    position: relative;
    background-size: contain;
    background-position: bottom;
    background-repeat: no-repeat;
    min-height: 400px;

    @media (min-width: 1179px) {
        background-position: ${({ last }) => (last ? 'right' : 'center')};
    }

    @media (max-width: 1180px) {
        min-height: ${({ last }) => (last ? '559px' : '400px')};
    }
`

const Item = styled.div.attrs({
    className: 'h-full',
})`
    position: absolute;
    top: 0;
    left: 0;
`

export default FeaturesLanding
