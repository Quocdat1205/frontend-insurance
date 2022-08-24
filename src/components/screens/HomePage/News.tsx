import React, { useEffect, useState } from 'react'
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import CardShadow from 'components/common/Card/CardShadow'
import { formatTime } from 'utils/utils'
import { useTranslation } from 'next-i18next'
import Config from 'config/config'
import Link from 'next/link'

const News = ({ news = [] }: any) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const [mount, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [])

    const renderNews = () => {
        const html: any = []
        news.map((item: any, index: number) => {
            const url = Config.blogUrl.nami_today + `/${item.slug}`
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
                                <div title={item.title} className="text-xl font-medium  line-clamp-2 min-h-[56px]">{item.title}</div>
                            </CardShadow>
                        </a>
                    </Link>
                </SwiperSlide>,
            )
        })
        return html
    }

    const pagination = {
        clickable: true,
        bulletClass: 'swiper-pagination-bullet !bg-txtSecondary',
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-red',
        horizontalClass: '!-bottom-[5px]',
        // renderBullet: (index: number, className: string) => {
        //     return `<span class="${className}"> ${index+1} </span>`
        // },
    }

    return (
        <section className="pt-20 sm:pt-[7.5rem] max-w-screen-insurance m-auto">
            <div className="text-2xl font-semibold -mb-2 px-4">{t('home:home:news')}</div>
            <Swiper
                pagination={pagination}
                modules={[Pagination, Autoplay]}
                className="mySwiper !px-4 !py-8"
                slidesPerView={4}
                breakpoints={{
                    300: {
                        slidesPerView: 1,
                        spaceBetween: 16,
                    },
                    640: {
                        slidesPerView: 3,
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
            >
                {mount && renderNews()}
            </Swiper>
        </section>
    )
}

export default News
