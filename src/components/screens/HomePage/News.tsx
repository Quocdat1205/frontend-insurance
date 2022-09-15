import React, { useEffect, useMemo, useState } from 'react'
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { PaginationOptions } from 'swiper/types'
import CardShadow from 'components/common/Card/CardShadow'
import Config from 'config/config'
import useWindowSize from 'hooks/useWindowSize'
import { formatTime } from 'utils/utils'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components'

const initPaginationState = {
    clickable: true,
    bulletClass: 'swiper-pagination-bullet !bg-txtSecondary',
    bulletActiveClass: 'swiper-pagination-bullet-active !bg-red',
    horizontalClass: '!-bottom-[5px]',
}
const News = ({ news = [] }: any) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { width } = useWindowSize()
    const [isMobile, setIsMobile] = useState<boolean>(true)

    const [mount, setMount] = useState(false)
    const [modules, setModules] = useState([Pagination])
    const [pagination, setPag] = useState<PaginationOptions>({ ...initPaginationState })

    const renderNews = () => {
        const html: any = []
        news.map((item: any, index: number) => {
            const url = `${Config.blogUrl.nami_today}/${item.slug}`
            html.push(
                <SwiperSlide key={index}>
                    <Link href={url}>
                        <a target="_blank">
                            <CardShadow className="p-4 min-h-[280px] cursor-pointer">
                                <div className="rounded-xl mb-6 ">
                                    <img src={item.feature_image} className="h-[140px] w-full rounded-xl" />
                                </div>
                                <div className="flex items-center text-sm mb-1">
                                    <span>{item.primary_tag.name}</span>
                                    &nbsp;/&nbsp;
                                    <span className="text-gray">{formatTime(item.created_at, 'dd.MM.yyyy')}</span>
                                </div>
                                <div title={item.title} className="text-xl font-medium  line-clamp-2 min-h-[56px]">
                                    {item.title}
                                </div>
                            </CardShadow>
                        </a>
                    </Link>
                </SwiperSlide>,
            )
        })
        return html
    }

    /* --------------------------------- Effect --------------------------------- */

    useEffect(() => {
        if (width && width < 640) {
            setModules([Pagination])
            setIsMobile(true)
        } else {
            setIsMobile(false)
            setModules([Pagination, Autoplay])
        }
    }, [width])

    useEffect(() => {
        setMount(true)
    }, [])

    const restProps = {
        $isMobile: isMobile,
    }
    return (
        <section className="pt-20 sm:pt-[7.5rem] px-4 lg:px-20">
            <div className="max-w-screen-insurance 4xl:max-w-screen-3xl m-auto">
                <div className="text-2xl sm:text-5xl font-semibold -mb-2 ">{t('home:home:news')}</div>
                <StyledNews
                    pagination={pagination}
                    modules={modules}
                    // modules={[Pagination, Autoplay]}
                    className="mySwiper !px-4 !py-8"
                    slidesPerView={4}
                    breakpoints={{
                        300: {
                            slidesPerView: 1.2,
                            spaceBetween: 16,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 16,
                        },
                        1080: {
                            slidesPerView: 4,
                            spaceBetween: 24,
                        },
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    {...restProps}
                >
                    {mount && renderNews()}
                </StyledNews>
            </div>
        </section>
    )
}

interface StyledNewsProps {
    $isMobile?: boolean
}

const StyledNews = styled(Swiper)<StyledNewsProps>`
    & > .swiper-pagination {
        display: ${({ $isMobile }) => ($isMobile ? 'none' : '')};
    }
`

export default News
