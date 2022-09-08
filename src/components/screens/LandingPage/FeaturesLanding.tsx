import AOS from 'aos';
import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import React , { useEffect } from 'react'
import styled from 'styled-components'
import "aos/dist/aos.css";
import {DURATION_AOS} from "utils/constants";

const FeaturesLanding = () => {
    const { t } = useTranslation()
    const features = [
        {
            img: '/images/screens/landing-page/ic_features_1.png',
            title: t('home:landing:asset_value'),
            content: t('home:landing:asset_value_content'),
        },
        {
            img: '/images/screens/landing-page/ic_features_2.png',
            title: t('home:landing:insurance_options'),
            content: t('home:landing:insurance_options_content'),
        },
        {
            img: '/images/screens/landing-page/ic_features_3.png',
            title: t('home:landing:multi_asset'),
            content: t('home:landing:multi_asset_content'),
        },
    ];

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <section className="px-4 lg:px-20">
            <div className="max-w-screen-insurance m-auto text-center flex flex-col justify-center items-center pt-20 sm:pt-[7.5rem]">
                <div className="text-2xl sm:text-[2.5rem] leading-8 sm:leading-10 font-semibold mb-4">{t('home:landing:unique_features')}</div>
                <div className="max-w-[632px] text-[0.875rem] lg:text-[1rem]">{t('home:landing:unique_features_content')}</div>
                <div className="flex flex-wrap space-y-6 sm:space-y-0 sm:gap-6 mt-7 sm:mt-9">
                    {features.map((item: any, index: number) => (
                        <Item key={index} data-aos="fade-up" data-aos-delay={DURATION_AOS * index}>
                            <div className="py-[19px] flex justify-center">
                                <img src={item.img} className="max-w-[120px]" />
                            </div>
                            <div className="flex flex-col space-y-2 mt-4 sm:mt-9 sm:text-left">
                                <div className="text-xl sm:text-2xl leading-7 sm:leading-9 font-medium text-red">{item.title}</div>
                                <div className="text-sm">{item.content}</div>
                            </div>
                        </Item>
                    ))}
                </div>
            </div>
        </section>
    )
}

const Item = styled.div.attrs({
    className: classnames(
        'flex flex-col flex-1 p-6 border-2 border-divider rounded-xl w-[calc(100%/3-24px)] min-w-[310px] cursor-pointer',
        'hover:border-gradient-hover-red hover:gradient-border-2',
    ),
})``

export default FeaturesLanding
