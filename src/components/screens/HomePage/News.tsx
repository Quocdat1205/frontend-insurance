import React, { useMemo } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import styled from 'styled-components';
import useWindowSize from 'hooks/useWindowSize';
//doc react-slick.neostack.com/docs/api/#swipeToSlide

export default function News() {
    const { width } = useWindowSize();
    const numberItem = useMemo(() => (width >= 767 ? (width > 1279 ? 4 : 2) : 1), [width]);
    const showDots = useMemo(() => (width >= 767 ? true : false), [width]);

    const renderSlides = () =>
        newsData(16).map((v, i) => {
            const { url, category, time, title } = v;
            return (
                <div key={i} className="pr-6">
                    <div className="rounded-xl p-4 mb-6 shadow-lv4">
                        <img src={url} alt="img" />
                        <div className="flex items-center mt-6 mb-1">
                            <div>{category} /</div>
                            <div className="text-txtSecondary">{time}</div>
                        </div>
                        <div className="font-medium text-[20px] leading-7">{title}</div>
                    </div>
                </div>
            );
        });
    return (
        <section id="News" className="ins_container font-medium">
            <div className="text-2xl md:text-5xl leading-10 mb-9">Tin tức</div>
            <NewStyles>
                <Slider
                    dots={showDots}
                    slidesToShow={numberItem}
                    slidesToScroll={numberItem}
                    autoplaySpeed={3000}
                    swipeToSlide={true}
                    autoplay={false}
                >
                    {renderSlides()}
                </Slider>
            </NewStyles>
        </section>
    );
}

const NewStyles = styled.div`
    .slick-list {
        padding: 1px;
    }
    .slick-track {
        /* display: flex;
        gap: 24px; */
    }

    .slick-dots {
        position: absolute;
        left: 0;
        bottom: -5px;
    }
    .slick-dots li.slick-active button:before {
        color: red;
    }
`;

const newsData = (num = 4) => {
    const arr = [];
    const data = {
        url: '/images/news1.png',
        category: 'TIN TUC',
        time: '18/07/2022',
        title: 'Nami Insurance - Bảo vệ tài sản số của bạn'
    };
    for (let index = 0; index < num; index++) {
        arr.push(data);
    }
    return arr;
};
