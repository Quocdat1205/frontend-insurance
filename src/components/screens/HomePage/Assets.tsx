import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useMemo, useState, useEffect } from 'react'
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Button from 'components/common/Button/Button'
import CardShadow from 'components/common/Card/CardShadow'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import useWindowSize from 'hooks/useWindowSize'
import { formatTime } from 'utils/utils'

import 'swiper/css'
import 'swiper/css/pagination'

const Assets = () => {
    const { t } = useTranslation()
    const { account } = useWeb3Wallet()
    const { width } = useWindowSize()
    const isMobile = width && width < 640

    const [mount, setMount] = useState(false)

    const onConnectWallet = () => {
        Config.connectWallet()
    }

    const onBuy = (key: string) => {
        if (!account) {
            Config.toast.show('error', t('common:please_connect_your_wallet'), {
                button: (
                    <button className="text-sm font-semibold underline" onClick={onConnectWallet}>
                        {t('common:connect_now')}
                    </button>
                ),
            })
        }
    }

    const pagination = useMemo(
        () => ({
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-txtSecondary',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-red',
            horizontalClass: '!-bottom-[5px]',
            enabled: !isMobile,
            // renderBullet: (index: number, className: string) => {
            //     return `<span class="${className}"> ${index+1} </span>`
            // },
        }),
        [isMobile],
    )

    useEffect(() => {
        setMount(true)
    }, [])

    const renderNews = () => (
        <div className="d-flex">
            <SwiperSlide>
                <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                    <div className="flex items-center space-x-3">
                        <img width="36" height="36" src="/images/icons/ic_bitcoin.png" />
                        <span className="font-semibold text-xl">Bitcoin</span>
                    </div>
                    <Button onClick={() => onBuy('bitcoin')} variants="outlined" className="py-3">
                        {t('home:landing:buy_covered')}
                    </Button>
                </CardShadow>
            </SwiperSlide>
            <SwiperSlide>
                <CardShadow className="p-6 flex flex-col space-y-6 w-full ">
                    <div className="flex items-center space-x-3">
                        <img width="36" height="36" src="/images/icons/ic_ethereum.png" />
                        <span className="font-semibold text-xl">Ethereum</span>
                    </div>
                    <Button onClick={() => onBuy('ethereum')} variants="outlined" className="py-3">
                        {t('home:landing:buy_covered')}
                    </Button>
                </CardShadow>
            </SwiperSlide>
            <SwiperSlide>
                <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                    <div className="flex items-center space-x-3">
                        <img width="36" height="36" src="/images/icons/ic_binance.png" />
                        <span className="font-semibold text-xl">Binance Coin</span>
                    </div>
                    <Button onClick={() => onBuy('binance')} variants="outlined" className="py-3">
                        {t('home:landing:buy_covered')}
                    </Button>
                </CardShadow>
            </SwiperSlide>
        </div>
    )

    return (
        <Swiper
            pagination={pagination}
            modules={[Pagination]}
            className="mySwiper !px-4 !py-6 !-mx-4"
            slidesPerView={4}
            breakpoints={{
                300: {
                    slidesPerView: 1.2,
                    spaceBetween: 16,
                },
                640: {
                    slidesPerView: 2.5,
                    spaceBetween: 16,
                },
                820: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                },
            }}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
        >
            {mount && renderNews()}
        </Swiper>
    )
}

export default Assets
