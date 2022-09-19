import { useTranslation } from 'next-i18next'
import React, { useMemo, useState, useEffect } from 'react'
import { Autoplay, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import Button from 'components/common/Button/Button'
import CardShadow from 'components/common/Card/CardShadow'
import Config from 'config/config'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import useWindowSize from 'hooks/useWindowSize'
import 'swiper/css'
import 'swiper/css/pagination'
import { RootStore, useAppSelector } from 'redux/store'
import { createSelector } from 'reselect'
import { useRouter } from 'next/router'

const getNewAssets = createSelector([(state: RootStore) => state.setting.assetsToken], (assetsToken) => {
    return assetsToken.filter((asset: any) => asset.isNew)
})

const Assets = () => {
    const { t } = useTranslation()
    const assetsToken = useAppSelector((state: RootStore) => getNewAssets(state))
    const { account } = useWeb3Wallet()
    const { width } = useWindowSize()
    const isMobile = width && width < 640
    const router = useRouter()
    const [mount, setMount] = useState(false)

    const onConnectWallet = () => {
        Config.connectWallet()
    }

    const onBuy = (id: string) => {
        if (!account) {
            Config.toast.show('error', t('common:please_connect_your_wallet'), {
                button: (
                    <button className="text-sm font-semibold underline" onClick={onConnectWallet}>
                        {t('common:connect_now')}
                    </button>
                ),
            })
        } else {
            console.log(id)

            let state: any = localStorage.getItem('buy_covered_state')

            const item = assetsToken.find((token: any) => {
                console.log(token)

                if (token._id === id) return token
            })

            if (item) {
                console.log(item)
                const res = JSON.parse(state)
                const newSymbol = {
                    timeframe: 'ALL',
                    margin: 0,
                    percent_margin: 0,
                    symbol: {
                        id: item._id,
                        name: item.name,
                        icon: item.attachment,
                        symbol: `${item.symbol}USDT`,
                        type: item.symbol,
                        disable: !item.isActive,
                    },
                    period: 2,
                    p_claim: 0,
                    q_claim: 0,
                    r_claim: 0,
                    q_covered: 0,
                    p_market: 0,
                    t_market: 0,
                    p_expired: 0,
                    index: 1,
                }
                localStorage.setItem('buy_covered_state', JSON.stringify({ ...newSymbol }))
            }
            setTimeout(() => {
                router.push('/buy-covered')
            }, 2000)
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
            {assetsToken.map((asset: any, index: number) => (
                <SwiperSlide key={index}>
                    <CardShadow className="p-6 flex flex-col space-y-6 w-full">
                        <div className="flex items-center space-x-3">
                            <img width="48" height="48" src={asset?.attachment} className="rounded-full" />
                            <span className="font-medium text-xl">{asset?.name}</span>
                        </div>
                        <Button onClick={() => onBuy(asset?._id)} variants="outlined" className="py-3 font-medium text-sm sm:text-base">
                            {t('home:landing:buy_covered')}
                        </Button>
                    </CardShadow>
                </SwiperSlide>
            ))}
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
