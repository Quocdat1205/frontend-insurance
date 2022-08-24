import React, {useEffect, useState} from 'react'
import useWindowSize from "hooks/useWindowSize";
import {screens} from "utils/constants";
import {LeftArrow} from "components/common/Svg/SvgIcon";
import {useTranslation} from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

//layout
import LayoutInsurance from 'components/layout/layoutInsurance'
import { Popover } from '@headlessui/react'
import {ChevronDown, Check} from 'react-feather'

//Props
import { GetStaticProps } from 'next'
import {Input} from "components/common/Input/input";

//interface
import {ICoin} from "components/common/Input/input.interface";
import {sync} from "postcss-load-config";

//chart
const ChartComponent = dynamic(() => import("../components/common/Chart/chartComponent"), { ssr: false });

const Insurance = () => {
    const {t} = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const [iCoin, setICoin] = useState<number>()
    const [isShow, setIsShow] = useState<boolean>(true)

    const listCoin: ICoin[] = [
            {
            id: 1,
            name: 'Ethereum',
            icon: '/images/icons/ic_ethereum.png',
            },
            {
                id: 2,
                name: 'Bitcoin ',
                icon: '/images/icons/ic_bitcoin.png',
            },
            {
                id: 3,
                name: 'Binance Coin ',
                icon: '/images/icons/ic_binance.png',
            }
        ]

    const [selectCoin,setSelectedCoin] = useState<ICoin>(listCoin[0])

    const menu = [
        { menuId: 'home', router: 'home', name: t('home:landing:home'), parentId: 0 },
        { menuId: 'insurance', router: 'insurance', name: t('home:landing:buy_covered'), parentId: 0 },
        { menuId: 'history-insurance', router: 'history-insurance', name: 'home:landing:history_insurance', parentId: 'insurance' },
        { menuId: 'back_to_home', router: 'home', name: t('home:landing:back_to_home'), parentId: 0 },
        { menuId: 'default', router: 'default', name: t('home:landing:default'), parentId: 0 },

    ]

    useEffect(() => {
        // setSelectedCoin(listCoin[0])
    }, [listCoin]);

    return (<LayoutInsurance>
                {
                    //subtitle
                    !isMobile && (
                    <div className="bg-[#eee]">
                        <ul className="breadcrumb max-w-screen-layout m-auto">
                            <li><a href="#">{menu[0].name}</a></li>
                            <li><a href="#">{menu[1].name}</a></li>
                        </ul>
                    </div>
                    )
                }

                {
                    // head Insurance
                    <div className="max-w-screen-layout m-auto flex items-center justify-between space-x-12 pt-[20px]   ">
                        <div className="flex items-center">
                            <LeftArrow/>
                            <span className={"pl-1"}>
                                {menu[3].name}
                            </span>
                        </div>
                        <div>
                            {menu[4].name}
                        </div>
                    </div>
                }

                {
                    //title
                }
                {
                    //chart
                    <div className={'max-w-screen-layout m-auto pt-[20px] w-[100%]'}>
                        {/*head*/}
                        <div className={'pb-5'}>Loại tài sản và số lượng tài sản</div>
                        <div className={'flex justify-between border-collapse rounded shadow-none'}>
                            <Input
                                className={"w-[75%] appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none"}
                                type={'number'}
                                inputName={'Loại tài sản và số lượng tài sản'}
                                idInput={'iCoin'}
                                value={iCoin}
                                onChange={(a:any) => {
                                    if(a.target.value <= 0 || a.target.value.length <=0) {
                                        setICoin(0)
                                    }else {
                                        setICoin(a.target.value)
                                    }
                                }}
                                placeholder={'0'}
                            />
                            <Popover className="relative w-[25%] outline-none bg-[#F7F8FA] focus:ring-0 rounded-none shadow-none flex items-center justify-center"                            >
                                <Popover.Button
                                    id={'popoverInsurance'}
                                    className={"flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0"}
                                    onClick={() => !isShow ? setIsShow(true) : setIsShow(false)}
                                >
                                    <img alt={''} src={`${selectCoin.icon}`} width="36" height="36" className={'mr-[5px]'}/>
                                    <span className={'w-[100px] flex flex-start'}>{selectCoin && selectCoin.name}</span>
                                    <ChevronDown size={18} className={'ml-5 mt-1'}/>
                                </Popover.Button>
                                {
                                    isShow && (
                                        <Popover.Panel className="absolute z-10 top-[50px] w-full rounded shadow">
                                            <div className="flex flex-col focus:border-0 focus:ring-0 active:border-0">
                                                {
                                                    listCoin && listCoin.map((coin, key) => {
                                                        let isPress = false
                                                        // @ts-ignore
                                                        return <a id={coin.id} key={key}
                                                                  onClick={() => {
                                                                      setIsShow(false)
                                                                  }}
                                                                  onMouseDown={() => isPress = true}
                                                                  onMouseUp={() => {
                                                                      isPress = false
                                                                      setSelectedCoin(coin)
                                                                  }}
                                                                  className={`${isPress ? "bg-[#F2F3F5]" : "hover:bg-[#F7F8FA]"} flex flex-row justify-start w-full items-center p-3`}
                                                        >
                                                            <img alt={''} src={`${coin.icon}`} width="36" height="36"
                                                                 className={'mr-[5px]'}/>
                                                            <div className={'flex flex-row justify-between w-full'}>
                                                                <span>{coin.name}</span>
                                                                {coin.id === selectCoin.id ?
                                                                    <Check size={18} className={'text-[#EB2B3E]'}/> : ''}
                                                            </div>
                                                        </a>
                                                    })
                                                }
                                            </div>
                                        </Popover.Panel>
                                    )
                                }
                            </Popover>

                        </div>
                        <div>

                        </div>
                        {/*body*/}
                        <ChartComponent />
                        {/*footer*/}
                    </div>

                }
            </LayoutInsurance>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'insurance'])),
    },
})

export default Insurance
