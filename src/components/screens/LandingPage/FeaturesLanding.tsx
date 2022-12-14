import AOS from 'aos'
import 'aos/dist/aos.css'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import styled from 'styled-components'
import { RightArrow } from 'components/common/Svg/SvgIcon'
import { DURATION_AOS } from 'utils/constants'

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
        <section className="px-4 mb:px-10 lg:px-20">
            <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto text-center flex flex-col justify-center items-center pt-20 sm:pt-[7.5rem]">
                <div className="mb-4 text-2xl font-semibold leading-8 sm:text-5xl">{t('home:landing:unique_features')}</div>
                <div className="max-w-[632px] text-[0.875rem] lg:text-[1rem]">{t('home:landing:unique_features_content')}</div>
                <div className="flex flex-wrap w-full space-y-6 sm:space-y-0 sm:gap-6 mt-7 sm:mt-9">
                    {features.map((item: any, index: number) => {
                        // break for last case -- use flex box to handle below
                        if (index === 2) return null
                        return (
                            <div key={item.img} className={'bg-hover flex flex-col flex-1 rounded-xl w-[calc(100%/2-24px)] h-full min-w-[310px]'}>
                                <Container
                                    data-aos={index === 0 ? 'fade-right' : 'fade-left'}
                                    data-aos-delay={DURATION_AOS * index}
                                    className={'flex'}
                                    img={item.img}
                                    last={LAST_INDEX === index}
                                >
                                    <Item key={index}>
                                        <div className="flex flex-col items-start justify-start h-full p-6 lg:justify-between">
                                            <div className={'sm:mt-9 text-left max-w-[370px] mb-6 sm:bm-0'}>
                                                <div className="mb-2 text-xl font-medium lg:text-2xl text-red">{item.title}</div>
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
                    <div
                        data-aos="fade-up"
                        data-aos-delay={DURATION_AOS * 2}
                        className="flex flex-col items-start justify-start w-full h-full rounded-xl bg-hover homeNav:flex-row lg:justify-between"
                    >
                        <div className={'flex-1 w-full h-full flex flex-col items-start justify-between md:min-h-[400px] p-6'}>
                            <div className={'md:mt-9 text-left max-w-[370px] mb-6 md:bm-0'}>
                                <div className="mb-2 text-xl font-medium md:text-2xl text-red">{features[2].title}</div>
                                <div className="text-sm md:text-base">{features[2].content}</div>
                            </div>
                            <p onClick={handleOnBuyCover} className={'text-red text-sm md:text-base font-semibold cursor-pointer'}>
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
        'w-full flex bg-contain md:pt-0 pt-2 bg-no-repeat lg:bg-cover rounded-b-xl lg:rounded-r-md ' +
        'h-[277px] sm:h-[400px] mt-[3.625rem] md:mt-0 lg:h-[400px]',
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
