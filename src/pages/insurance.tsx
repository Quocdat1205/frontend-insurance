import {useEffect, useState} from 'react'
import useWindowSize from "hooks/useWindowSize";
import {screens} from "utils/constants";
import {CheckCircle, LeftArrow, ErrorMessage} from "components/common/Svg/SvgIcon";
import {useTranslation} from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Config from 'config/config'
import throttle from 'lodash/throttle'

//layout
import LayoutInsurance from 'components/layout/layoutInsurance'
import { Popover, Tab } from '@headlessui/react'
import {ChevronDown, Check} from 'react-feather'

//Props
import { GetStaticProps } from 'next'
import {Input} from "components/common/Input/input";

//interface
import {ICoin} from "components/common/Input/input.interface";
import Button from "components/common/Button/Button";
import Toast from "components/layout/Toast";

//chart
const ChartComponent = dynamic(() => import("../components/common/Chart/chartComponent"), { ssr: false });

const testdefault = {
    address: '0x77C52F41b77711FcE24D47b4fA1f5012D76bC0D4',
    USDT: 15000
}

const Insurance = () => {
    const {t} = useTranslation()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const diff_claim = 0.05
    const [iCoin, setICoin] = useState<number>()
    const [percentInsurance,setPercentInsurance] = useState<number>(0)
    const [selectTime,setSelectTime] = useState<string>('ALL')
    const [selectPeriod, setSelectPeriod] = useState<number>(2)
    const [isLoading, setLoading] = useState(false)

    const [index,setIndex] = useState<1|2>(1)

    const [state, setState] = useState({
        margin: 0,
        typeCoin: {},
        period: 0,
        p_claim: 0,
        q_claim: 0,
        r_claim: 0,
        q_covered: 0,
    });

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
                disable: true
            }
        ]
    const [selectCoin,setSelectedCoin] = useState<ICoin>(listCoin[0])

    const listTime = ['1H', "1D", '1W', '1M', '3M', '1Y', 'ALL']
    const listTabPeriod: number[] =[2,3,4,5,6,7,8,9,10,11,12,13,14,15]



    const menu = [
        { menuId: 'home', router: 'home', name: t('home:landing:home'), parentId: 0 },
        { menuId: 'insurance', router: 'insurance', name: t('home:landing:buy_covered'), parentId: 0 },
        { menuId: 'history-insurance', router: 'history-insurance', name: 'home:landing:history_insurance', parentId: 'insurance' },
        { menuId: 'back_to_home', router: 'home', name: t('home:landing:back_to_home'), parentId: 0 },
        { menuId: 'default', router: 'default', name: t('home:landing:default'), parentId: 0 },

    ]

    useEffect(() => {
        if(iCoin && iCoin > 0){
            setState({...state,q_covered: iCoin})
            const percent : number = Number((iCoin/testdefault.USDT*100).toFixed(2))
            setPercentInsurance(percent)
        }
        if(selectPeriod && selectPeriod > 2){
            setState({...state,period: selectPeriod})
        }
        if(selectCoin){
            setState({...state,typeCoin: selectCoin})
        }

        handleCheckValidate()
    }, [iCoin, selectPeriod, selectCoin]);

    const handleCheckValidate =  () => {
        if (!iCoin || isLoading) return
        if (iCoin > testdefault.USDT) {
            Config.toast.show('error', t('insurance:buy:input_invalid'))
            return
        }

    }



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
                    <div className={'flex flex-col justify-center items-center mt-[20px] mb-[32px] '}>
                        <div>{index}/2</div>
                        <div className={'font-semibold text-[32px] leading-[44px]'}>Mua bảo hiểm</div>
                    </div>
                }
                {
                    //chart
                    <div className={'max-w-screen-layout m-auto pt-[20px] w-[100%] shadow border border-1 border-[#E5E7E8] rounded-[12px] mt-[32px]'}>
                        {/*head*/}
                        <div className={'pb-[8px] pl-[32px] pt-[32px] text-[14px] leading-5 text-[#808890]'}>Loại tài sản và số lượng tài sản</div>
                        <div className={'pb-[8px] pl-[32px] pr-[32px] h-[70px] flex justify-between border-collapse rounded-[3px] shadow-none'}>
                            <Input
                                className={"w-[75%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none"}
                                type={'number'}
                                inputName={'Loại tài sản và số lượng tài sản'}
                                idInput={'iCoin'}
                                value={iCoin && iCoin}
                                onChange={(a:any) => {
                                    if(a.target.value*1 < 0 || a.target.value.length <=0 ) {
                                        setICoin(0)
                                    }else {
                                        setICoin(a.target.value.replace(/^0+/, ''))
                                    }
                                    setPercentInsurance(0)

                                    if(a.target.value*1 > testdefault.USDT){
                                        return setICoin(testdefault.USDT)
                                    }
                                }}
                                placeholder={'0'}
                            />
                            <div>
                                <Toast/>
                            </div>
                            <Popover className="relative w-[25%] outline-none bg-[#F7F8FA] focus:ring-0 rounded-none shadow-none flex items-center justify-center pr-[21px]"                            >
                                <Popover.Button
                                    id={'popoverInsurance'}
                                    className={"flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0"}
                                >
                                    <img alt={''} src={`${selectCoin.icon}`} width="36" height="36" className={'mr-[4px]'}/>
                                    <span className={'w-[104px] flex flex-start font-semibold text-[#EB2B3E] text-base'}>{selectCoin && selectCoin.name}</span>
                                    <ChevronDown size={18} className={'mt-1 text-[#22313F]'}/>
                                </Popover.Button>
                                <Popover.Panel className="absolute z-50 bg-white top-[78px] right-0 h-[208px] w-[360px] w-full rounded shadow">
                                    {({ close }) => (
                                        <div className="flex flex-col focus:border-0 focus:ring-0 active:border-0">
                                            {
                                                listCoin && listCoin.map((coin, key) => {
                                                    let isPress = false
                                                    // @ts-ignore
                                                    return !coin.disable ? <a id={coin.id} key={key}
                                                              onMouseDown={() => isPress = true}
                                                              onMouseUp={() => {
                                                                  isPress = false
                                                                  setSelectedCoin(coin)
                                                                  close()
                                                              }}
                                                              className={`${isPress ? "bg-[#F2F3F5]" : "hover:bg-[#F7F8FA]"} flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                        >
                                                            <img alt={''} src={`${coin.icon}`} width="36" height="36"
                                                                 className={'mr-[5px]'}/>
                                                            <div className={'flex flex-row justify-between w-full'}>
                                                                <span className={'hover:cursor-default'}>{coin.name}</span>
                                                                {coin.id === selectCoin.id ?
                                                                    <Check size={18} className={'text-[#EB2B3E]'}/> : ''}
                                                            </div>
                                                        </a>
                                                        :
                                                        <a id={`${coin.id}`} key={key}
                                                           className={`hover:bg-[#F7F8FA] flex flex-row justify-start w-full items-center p-3 text-[#E5E7E8] font-medium`}
                                                        >
                                                            <img alt={''} src={`${coin.icon}`} width="36" height="36"
                                                                 className={'mr-[5px] grayscale hover:cursor-default'}/>
                                                            <div className={'flex flex-row justify-between w-full'}>
                                                                <span>{coin.name}</span>
                                                                {coin.id === selectCoin.id ?
                                                                    <Check size={18} className={'text-[#EB2B3E]'}/> : ''}
                                                            </div>
                                                        </a>
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                        </Popover.Panel>
                            </Popover>

                        </div>
                        <div className={'flex flex-row justify-between mt-[8px]'}>
                            <div className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'} onClick={() => setICoin(25/100*testdefault.USDT)}>
                                <div className={`${ percentInsurance == 25 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}/>
                                <span>25%</span>
                            </div>
                            <div className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'} onClick={() => setICoin(50/100*testdefault.USDT)}>
                                <div className={`${50 == percentInsurance ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}/>
                                <span className={''}>50%</span>
                            </div>
                            <div className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'} onClick={() => setICoin(75/100*testdefault.USDT)}>
                                <div className={`${75 == percentInsurance  ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}/>
                                <span className={''}>75%</span>
                            </div>
                            <div className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'} onClick={() => setICoin(testdefault.USDT)}>
                                <div className={`${percentInsurance == 100 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}/>
                                <span>100%</span>
                            </div>
                        </div>
                        {/*end head*/}

                        {/*body*/}
                        <div className={'pl-[32px] pr-[32px]'}>
                            <ChartComponent />
                        </div>
                        {/*end body*/}

                        {/*footer*/}
                        {/* fill of time */}
                        <div className={'flex flex-row justify-between items-center w-full mt-5 pl-[32px] pr-[32px]'}>
                            {
                                listTime.map((time,key) => {
                                    return (
                                        <div key={key}
                                            className={`${selectTime == time && 'text-[#EB2B3E]'} hover:cursor-pointer font-medium text-[#808890] text-base`}
                                            onClick={() => setSelectTime(time)}
                                        >{time}</div>
                                    )
                                })
                            }
                        </div>

                        {/* Period */}
                        <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px]'}>
                            <span>Period (ngày)</span>
                            <Tab.Group>
                                <Tab.List className={'flex flex-row justify-between mt-[20px] w-[85%]'}>
                                    {
                                        listTabPeriod.map((item) => {
                                            return <div
                                                className={`${selectPeriod == item && 'bg-[#FFF1F2] text-[#EB2B3E]'} bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center`}
                                                onClick={() => setSelectPeriod(item)}
                                            >{item}</div>
                                        })
                                    }
                                </Tab.List>
                            </Tab.Group>
                        </div>
                    </div>
                }

                     {/*Only Show Claim And Margin*/}
            <div className={'max-w-screen-layout m-auto flex flex-row justify-between items-center mt-[24px] hover:cursor-default'}>
                <div className={'flex flex-row justify-between items-center w-[30%] rounded-[12px] border border-[#E5E7E8] border-[0.5px] pl-[24px] pr-[24px] pt-[16px] pb-[16px]'}>
                    <div className={'text-[#808890]'}>R-Claim</div>
                    <div className={'font-semibold'}>
                        <span>%</span>
                    </div>
                </div>
                <div className={'flex flex-row justify-between items-center w-[30%] rounded-[12px] border border-[#E5E7E8] border-[0.5px] pl-[24px] pr-[24px] pt-[16px] pb-[16px]'}>
                    <div className={'text-[#808890]'}>Q-Claim</div>
                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                        <span className={'text-[#EB2B3E]'}>USDT</span>
                        <ChevronDown size={18} className={'ml-1 mt-1'}/>
                    </div>
                </div>
                <div className={'flex flex-row justify-between items-center w-[30%] rounded-[12px] border border-[#E5E7E8] border-[0.5px] pl-[24px] pr-[24px] pt-[16px] pb-[16px]'}>
                    <div className={'text-[#808890]'}>Margin</div>
                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                        <span className={'text-[#EB2B3E]'}>USDT</span>
                        <ChevronDown size={18} className={'ml-1 mt-1'}/>
                    </div>
                </div>
            </div>

            {/* description  */}
            <div className={'flex justify-center items-center mt-[24px]'}>
                <CheckCircle />
                <span className={'font-semibold text-[#22313F]'}>Tiết kiệm <span className={"text-[#EB2B3E]"}>1,000 USDT</span> so với không mua bảo hiểm</span>
            </div>

            {/* the next level*/}
            <div className={'flex flex-col justify-center items-center mt-[146px]'}>
                <Button
                    variants={'primary'}
                    className={'bg-[#EB2B3E] h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]'}
                >Tiếp theo</Button>
                <Button
                    variants={'primary'}
                    className={'my-[16px] text-[#00ABF9] underline'}
                    onClick={() => {}}
                >Hướng dẫn mua bảo hiểm</Button>
            </div>

            </LayoutInsurance>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'insurance'])),
    },
})

export default Insurance
