import {useEffect, useState} from 'react'
import useWindowSize from "hooks/useWindowSize";
import {screens} from "utils/constants";
import {LeftArrow} from "components/common/Svg/SvgIcon";
import {useTranslation} from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'

//layout
import LayoutInsurance from 'components/layout/layoutInsurance'

//Props
import { GetStaticProps } from 'next'
import {Input} from "components/common/Input/input";

//interface
import {ICoin} from "components/common/Input/input.interface";

//chart
const ChartComponent = dynamic(() => import("../components/common/Chart/chartComponent"), { ssr: false });

const Insurance = () => {
    const {t} = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const [iCoin, setICoin] = useState<number>()

    const [selectCoin,setSelectedCoin] = useState<ICoin[]>(
        [{
            id: 1,
            name: 'Ethereum',
            icon: 'public/images/icons/ic_ethereum.png',
        },
            {
                id: 2,
                name: 'Bitcoin ',
                icon: 'public/images/icons/ic_bitcoin.png',
            },
            {
                id: 3,
                name: 'Binance Coin ',
                icon: 'public/images/icons/ic_binance.png',
            }]
    )


    const menu = [
        { menuId: 'home', router: 'home', name: t('home:landing:home'), parentId: 0 },
        { menuId: 'insurance', router: 'insurance', name: t('home:landing:buy_covered'), parentId: 0 },
        { menuId: 'history-insurance', router: 'history-insurance', name: 'home:landing:history_insurance', parentId: 'insurance' },
        { menuId: 'back_to_home', router: 'home', name: t('home:landing:back_to_home'), parentId: 0 },
        { menuId: 'default', router: 'default', name: t('home:landing:default'), parentId: 0 },

    ]



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
                    //chart Insurance
                    <div className={'max-w-screen-layout m-auto pt-[20px] w-[100%]'}>
                        <div className={'pb-5'}>Loại tài sản và số lượng tài sản</div>
                        <div className={'flex justify-between border-collapse rounded shadow-none'}>
                            <Input
                                className={"w-[75%] appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none"}
                                type={'number'}
                                inputName={'Loại tài sản và số lượng tài sản'}
                                idInput={'iCoin'}
                                value={iCoin}
                                onChange={a => {
                                    if(a.target.value <= 0 || a.target.value.length <=0) {
                                        setICoin(0)
                                    }else {
                                        setICoin(a.target.value)
                                    }
                                }}
                                placeholder={'0'}
                            />

                        </div>
                        <ChartComponent />
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
