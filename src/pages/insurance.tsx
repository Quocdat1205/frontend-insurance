import { useEffect, useState } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { CheckCircle, LeftArrow, InfoCircle } from 'components/common/Svg/SvgIcon'
import { ChevronDown, Check, ChevronUp } from 'react-feather'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import Config from 'config/config'

//layout
import LayoutInsurance from 'components/layout/layoutInsurance'
import { Popover, Tab } from '@headlessui/react'
import { AcceptBuyInsurance } from '../components/screens/Insurance/AcceptBuyInsurance'

//Props
import { GetStaticProps } from 'next'
import { Input } from 'components/common/Input/input'

//interface
import { ICoin } from 'components/common/Input/input.interface'
import Button from 'components/common/Button/Button'
import { useRouter } from 'next/router'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import NotificationInsurance from 'components/layout/notifucationInsurance'

//chart
const ChartComponent = dynamic(() => import('../components/common/Chart/chartComponent'), { ssr: false, loading: () => <header /> })

const Insurance = () => {
    const { t } = useTranslation()
    const wallets = useWeb3Wallet()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const [percentInsurance, setPercentInsurance] = useState<number>(0)
    const [selectTime, setSelectTime] = useState<string>('ALL')
    const [isDrop, setDrop] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [checkUpgrade, setCheckUpgrade] = useState(false)

    const [index, setIndex] = useState<1 | 2>(1)
    const [tab, setTab] = useState<number>(3)

    const [userBalance, setUserBalance] = useState<number>(0)

    const [state, setState] = useState({
        timeframe: '',
        margin: 0,
        symbol: {},
        period: 2,
        p_claim: 0,
        q_claim: 0,
        r_claim: 0,
        q_covered: 0,
    })

    const [dataChart, setDataChart] = useState()
    const listCoin: ICoin[] = [
        {
            id: 1,
            name: 'Ethereum',
            icon: '/images/icons/ic_ethereum.png',
            symbol: 'ETHUSDT',
        },
        {
            id: 2,
            name: 'Bitcoin ',
            icon: '/images/icons/ic_bitcoin.png',
            symbol: 'BTCUSDT',
        },
        {
            id: 3,
            name: 'Binance Coin ',
            icon: '/images/icons/ic_binance.png',
            disable: true,
            symbol: 'BNBUSDT',
        },
    ]
    const [selectCoin, setSelectedCoin] = useState<ICoin>(listCoin[0])

    const fetchApi = async (symbol: string, from: string, to: string, resolution: string, setDataChart: any) => {
        const response = await fetch(
            'https://datav2.nami.exchange/api/v1/chart/history?' +
                'broker=NAMI_SPOT' +
                '&symbol=' +
                symbol +
                '&from=' +
                from +
                '&to=' +
                to +
                '&resolution=' +
                resolution,
        )
        let list = await response.json()
        let data: { date: number; value: any }[] = []
        list.map((item: any) => {
            data.push({
                date: item[0] * 1000,
                value: item[1],
            })
        })
        data.length > 0 && setDataChart(data)
    }

    useEffect(() => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        timeBegin.setDate(timeEnd.getDate() - 100)
        fetchApi('BTCUSDT', `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1d', setDataChart)
    }, [])

    useEffect(() => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        if (selectTime == '1H' || selectTime == '1D') {
            timeBegin.setDate(timeEnd.getDate() - 1)
            fetchApi(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1m', setDataChart)
        } else if (selectTime == '1W') {
            timeBegin.setDate(timeEnd.getDate() - 7)
            fetchApi(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1h', setDataChart)
        } else {
            timeBegin.setDate(timeEnd.getDate() - 7)
            fetchApi(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1d', setDataChart)
        }
    }, [selectTime, selectCoin])

    // setInterval(() => {
    //     const timeEnd = new Date()
    //     const timeBegin = new Date()
    //     if (selectTime == '1H' || selectTime == '1D') {
    //         timeBegin.setDate(timeEnd.getDate() - 1)
    //         fetchApi(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1m', setDataChart)
    //     } else if (selectTime == '1W') {
    //         timeBegin.setDate(timeEnd.getDate() - 7)
    //         fetchApi(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1h', setDataChart)
    //     } else {
    //         timeBegin.setDate(timeEnd.getDate() - 7)
    //         fetchApi(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1d', setDataChart)
    //     }
    // }, 6000)

    useEffect(() => {
        if (wallets) {
            setUserBalance(wallets.Balance || 10000)
        }
    }, [wallets])

    const listTime = ['1H', '1D', '1W', '1M', '3M', '1Y', 'ALL']
    const listTabPeriod: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

    const menu = [
        { menuId: 'home', router: 'home', name: t('insurance:buy:home'), parentId: 0 },
        { menuId: 'buy_covered', router: 'insurance', name: t('insurance:buy:buy_covered'), parentId: 0 },
        { menuId: 'back_to_home', router: 'home', name: t('insurance:buy:back_to_home'), parentId: 0 },
        { menuId: 'default', name: t('insurance:buy:default'), parentId: 0 },
        { menuId: 'change_r_claim', name: t('insurance:buy:change_r_claim'), parentId: 0 },
        { menuId: 'change_q_claim', name: t('insurance:buy:change_q_claim'), parentId: 0 },
        { menuId: 'change_margin', name: t('insurance:buy:change_margin'), parentId: 0 },
        { menuId: 'quality_and_type', name: t('insurance:buy:quality_and_type') },
        { menuId: 'day', name: t('insurance:buy:day') },
        { menuId: 'example', name: t('insurance:buy:example') },
        { menuId: 'tooltip', name: t('insurance:buy:tooltip') },
        { menuId: 'continue', name: t('insurance:buy:continue') },
        { menuId: 'help', name: t('insurance:buy:help') },
    ]

    useEffect(() => {
        if (state.q_covered) {
            const percent: number = Number(((state.q_covered / userBalance) * 100).toFixed(2))
            setPercentInsurance(percent)
        }
        if (selectCoin) {
            setState({ ...state, symbol: selectCoin })
        }
        handleFillData()
    }, [state.q_covered, state.period, selectCoin, state.margin, state.p_claim])

    useEffect(() => {
        console.log(tab)
        router.push(`?query=${tab}`)
    }, [tab])

    const handleFillData = () => {
        handleCheckValidate()
        if (router.query.query === '3') {
            const q_covered = state.q_covered
            const p_claim = state.p_claim
            const r_claim = 220
        }
    }

    const handleCheckValidate = () => {
        if (state.q_covered <= 0) return true
        if (state.q_covered <= 0) return true
        if (state.q_covered > userBalance) {
            Config.toast.show('error', t('insurance:buy:input_invalid'))
            return true
        }

        return false
    }
    return (
        <LayoutInsurance>
            {
                //subtitle
                !isMobile && (
                    <div className="bg-[#eee]">
                        <ul className="breadcrumb max-w-screen-layout m-auto">
                            <li>
                                <a href="#">{menu[0].name}</a>
                            </li>
                            <li>
                                <a href="#">{menu[1].name}</a>
                            </li>
                        </ul>
                    </div>
                )
            }
            {
                // head Insurance
                <div className="max-w-screen-2xl m-auto flex items-center justify-between space-x-12 pt-[20px]   ">
                    <div className="flex items-center">
                        <LeftArrow />
                        <span className={'pl-1 font-semibold text-[#22313F] hover:cursor-pointer'} onClick={() => router.push('/ ')}>
                            {menu[2].name}
                        </span>
                    </div>
                    <Popover className="relative">
                        <Popover.Button
                            className={
                                'border border-[0.5] border-[#F7F8FA] rounded-[6px] h-[40px] w-auto py-[8px] px-[12px] flex flex-row bg-[#F7F8FA] shadow'
                            }
                            onClick={() => setDrop(true)}
                        >
                            {menu[tab].name}
                            {!isDrop && <ChevronDown />}
                            {isDrop && <ChevronUp />}
                        </Popover.Button>
                        <Popover.Panel className="absolute z-50 bg-white w-[260px] right-0 top-[48px] rounded shadow">
                            {({ close }) => (
                                <div className="flex flex-col justify-center h-full ">
                                    {menu.map((e, key) => {
                                        let Press = false
                                        return (
                                            key >= 3 &&
                                            key <= 6 && (
                                                <div
                                                    onClick={() => {
                                                        setTab(key)
                                                        setDrop(false)
                                                        close()
                                                    }}
                                                    key={key}
                                                    onMouseDown={() => (Press = true)}
                                                    onMouseUp={() => (Press = false)}
                                                    className={`${
                                                        Press ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'
                                                    } flex flex-row justify-start w-full items-center p-3 font-medium hover:cursor-pointer`}
                                                >
                                                    <div className={'flex flex-row justify-between w-full px-[16px] py-[6px] '}>
                                                        <span> {e.name} </span>
                                                        {tab === key ? <Check size={18} className={'text-[#EB2B3E]'} /> : ''}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    })}
                                </div>
                            )}
                        </Popover.Panel>
                    </Popover>
                </div>
            }

            {
                //title
                <div className={'flex flex-col justify-center items-center mt-[20px] mb-[32px] '}>
                    <div>{index}/2</div>
                    <div className={'font-semibold text-[32px] leading-[44px]'}>{index == 1 ? menu[1].name : t('insurance:buy:info_covered')}</div>
                </div>
            }
            {
                //chart
                index == 1 && (
                    <div className={'max-w-screen-layout m-auto h-auto pt-[20px] w-[100%] shadow border border-1 border-[#E5E7E8] rounded-[12px] mt-[32px]'}>
                        {/*head*/}
                        <div className={'pb-[8px] pl-[32px] pt-[32px] text-[14px] leading-5 text-[#808890] flex flex-row justify-start items-center'}>
                            <div className={'w-1/2'}>{menu[7].name}</div>
                            <div className={'w-1/2'}>{tab == 4 ? 'R-Claim' : tab == 5 ? 'Q-Claim' : tab == 6 && 'Margin'}</div>
                        </div>
                        <div className={'pb-[8px] pl-[32px] pr-[32px] h-[70px] flex justify-between'}>
                            <div className={`${tab > 3 ? 'w-[50%] mr-[12px]' : 'w-full'} flex justify-between border-collapse rounded-[3px] shadow-none`}>
                                <Input
                                    className={'w-[75%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'}
                                    type={'number'}
                                    inputName={'Loại tài sản và số lượng tài sản'}
                                    idInput={'iCoin'}
                                    value={state.q_covered && state.q_covered}
                                    onChange={(a: any) => {
                                        if (a.target.value * 1 < 0 || a.target.value.length <= 0) {
                                            setState({ ...state, q_covered: 0 })
                                        } else {
                                            setState({ ...state, q_covered: a.target.value.replace(/^0+/, '') })
                                        }
                                        setPercentInsurance(0)

                                        if (a.target.value * 1 > userBalance) {
                                            return setState({ ...state, q_covered: userBalance })
                                        }
                                    }}
                                    placeholder={'0'}
                                />
                                <Popover className="relative w-[25%] outline-none bg-[#F7F8FA] focus:ring-0 rounded-none shadow-none flex items-center justify-center pr-[21px]">
                                    <Popover.Button
                                        id={'popoverInsurance'}
                                        className={'flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0'}
                                    >
                                        <img alt={''} src={`${selectCoin.icon}`} width="36" height="36" className={'mr-[4px]'} />
                                        <span className={'w-[104px] flex flex-start font-semibold text-[#EB2B3E] text-base'}>
                                            {selectCoin && selectCoin.name}
                                        </span>
                                        <ChevronDown size={18} className={'mt-1 text-[#22313F]'} />
                                    </Popover.Button>
                                    <Popover.Panel className="absolute z-50 bg-white top-[78px] right-0  w-[360px] rounded shadow">
                                        {({ close }) => (
                                            <div className="flex flex-col focus:border-0 focus:ring-0 active:border-0">
                                                {listCoin &&
                                                    listCoin.map((coin, key) => {
                                                        let isPress = false
                                                        // @ts-ignore
                                                        return !coin.disable ? (
                                                            <a
                                                                id={`${coin.id}`}
                                                                key={key}
                                                                onMouseDown={() => (isPress = true)}
                                                                onMouseUp={() => {
                                                                    isPress = false
                                                                    setSelectedCoin(coin)
                                                                }}
                                                                onClick={() => close()}
                                                                className={`${
                                                                    isPress ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'
                                                                } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                            >
                                                                <img alt={''} src={`${coin.icon}`} width="36" height="36" className={'mr-[5px]'} />
                                                                <div className={'flex flex-row justify-between w-full'}>
                                                                    <span className={'hover:cursor-default'}>{coin.name}</span>
                                                                    {coin.id === selectCoin.id ? <Check size={18} className={'text-[#EB2B3E]'} /> : ''}
                                                                </div>
                                                            </a>
                                                        ) : (
                                                            <a
                                                                id={`${coin.id}`}
                                                                key={key}
                                                                className={`hover:bg-[#F7F8FA] flex flex-row justify-start w-full items-center p-3 text-[#E5E7E8] font-medium`}
                                                            >
                                                                <img
                                                                    alt={''}
                                                                    src={`${coin.icon}`}
                                                                    width="36"
                                                                    height="36"
                                                                    className={'mr-[5px] grayscale hover:cursor-default'}
                                                                />
                                                                <div className={'flex flex-row justify-between w-full'}>
                                                                    <span>{coin.name}</span>
                                                                    {coin.id === selectCoin.id ? <Check size={18} className={'text-[#EB2B3E]'} /> : ''}
                                                                </div>
                                                            </a>
                                                        )
                                                    })}
                                            </div>
                                        )}
                                    </Popover.Panel>
                                </Popover>
                            </div>
                            {tab > 3 && (
                                <div className={`${tab > 3 ? 'w-[50%]' : 'hidden'} ml-[12px] flex justify-between border-collapse rounded-[3px] shadow-none`}>
                                    <Input
                                        className={'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'}
                                        type={'number'}
                                        inputName={'P-Claim'}
                                        idInput={''}
                                        value={tab == 4 ? state.r_claim : tab == 5 ? state.q_claim : tab == 6 && state.margin}
                                        onChange={(a: any) => {
                                            if (tab == 4) {
                                                if (a.target.value * 1 < 0 || a.target.value.length <= 0) {
                                                    setState({ ...state, r_claim: 0 })
                                                } else {
                                                    setState({ ...state, r_claim: a.target.value.replace(/^0+/, '') })
                                                }
                                            } else if (tab == 5) {
                                                if (a.target.value * 1 < 0 || a.target.value.length <= 0) {
                                                    setState({ ...state, q_claim: 0 })
                                                } else {
                                                    setState({ ...state, q_claim: a.target.value.replace(/^0+/, '') })
                                                }
                                            } else if (tab == 6) {
                                                if (a.target.value * 1 < 0 || a.target.value.length <= 0) {
                                                    setState({ ...state, margin: 0 })
                                                } else {
                                                    setState({ ...state, margin: a.target.value.replace(/^0+/, '') })
                                                }
                                            }
                                        }}
                                        placeholder={''}
                                    />
                                    <div className={'bg-[#F7F8FA] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>{tab == 4 ? '%' : 'USDT'}</div>
                                </div>
                            )}
                        </div>
                        <div className={`${tab > 3 ? 'w-[50%] pl-[16px]' : 'w-full'} flex flex-row justify-between mt-[8px]`}>
                            <div
                                className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                onClick={() => setState({ ...state, q_covered: (25 / 100) * userBalance })}
                            >
                                <div className={`${percentInsurance == 25 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                <span>25%</span>
                            </div>
                            <div
                                className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                onClick={() => setState({ ...state, q_covered: (50 / 100) * userBalance })}
                            >
                                <div className={`${50 == percentInsurance ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                <span className={''}>50%</span>
                            </div>
                            <div
                                className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                onClick={() => setState({ ...state, q_covered: (75 / 100) * userBalance })}
                            >
                                <div className={`${75 == percentInsurance ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                <span className={''}>75%</span>
                            </div>
                            <div
                                className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                onClick={() => setState({ ...state, q_covered: userBalance })}
                            >
                                <div className={`${percentInsurance == 100 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                <span>100%</span>
                            </div>
                        </div>
                        {/*end head*/}

                        {/*body*/}
                        <div className={'pl-[32px] pr-[32px] flex flex-row relative'}>
                            <ChartComponent data={dataChart} />
                            <svg className={'absolute right-[95px]'} width="10" height="458" viewBox="0 0 2 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="1" y1="3.5011e-08" x2="0.999987" y2="240" stroke="#B2B7BC" strokeWidth="150" strokeDasharray="0.74 3.72" />
                            </svg>
                        </div>
                        {/*end body*/}

                        {/*footer*/}
                        {/* fill of time */}
                        <div className={'flex flex-row justify-between items-center w-full mt-5 pl-[32px] pr-[32px]'}>
                            {listTime.map((time, key) => {
                                return (
                                    <div
                                        key={key}
                                        className={`${selectTime == time ? 'text-[#EB2B3E]' : 'text-[#808890]'} hover:cursor-pointer font-medium  text-base`}
                                        onClick={() => {
                                            setSelectTime(time)
                                        }}
                                    >
                                        {time}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Period */}
                        <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px]'}>
                            <span>Period ({menu[8].name})</span>
                            <Tab.Group>
                                <Tab.List className={'flex flex-row justify-between mt-[20px] w-[85%]'}>
                                    {listTabPeriod.map((item, key) => {
                                        return (
                                            <div
                                                key={key}
                                                className={`${
                                                    state.period == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer`}
                                                onClick={() => setState({ ...state, period: item })}
                                            >
                                                {item}
                                            </div>
                                        )
                                    })}
                                </Tab.List>
                            </Tab.Group>
                        </div>

                        {/*P-Claim*/}
                        <div className={'my-[24px] px-[32px]'}>
                            <span className={'flex flex-row items-center'}>
                                P-Claim
                                {
                                    <span className={'tooltip_p_claim relative'} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                                        <InfoCircle />
                                        <span
                                            className={`${
                                                isHover ? 'visible' : 'hidden'
                                            } tooltip_p_claim_text px-[8px] py-[4px] shadow-lg w-[400px] bg-[white] text-[black] text-center rounded-[6px] border border-0.5 border-[#e5e7e8] absolute z-10 left-[28px] top-[-33px]`}
                                        >
                                            {menu[10]?.name} - {menu[9]?.name}
                                        </span>
                                    </span>
                                }
                            </span>
                            <div className={'mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none '}>
                                <Input
                                    className={'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'}
                                    type={'number'}
                                    inputName={'P-Claim'}
                                    idInput={'iPClaim'}
                                    value={state.p_claim}
                                    onChange={(a: any) => {
                                        if (a.target.value * 1 < 0 || a.target.value.length <= 0) {
                                            setState({ ...state, p_claim: 0 })
                                        } else {
                                            setState({ ...state, p_claim: a.target.value.replace(/^0+/, '') })
                                        }
                                    }}
                                    placeholder={`${menu[9].name}`}
                                />
                                <div className={'bg-[#F7F8FA] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>USDT</div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/*Only Show Claim And Margin*/}
            {index == 1 && (
                <div className={'max-w-screen-layout m-auto flex flex-row justify-center items-center mt-[24px] hover:cursor-default'}>
                    <div
                        className={`${
                            tab == 4 ? 'hidden' : ''
                        } flex flex-row justify-between items-center w-[30%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] mx-[12px]`}
                    >
                        <div className={'text-[#808890]'}>R-Claim</div>
                        <div className={'font-semibold'}>
                            <span>{state.r_claim}%</span>
                        </div>
                    </div>
                    <div
                        className={`${
                            tab == 5 ? 'hidden' : ''
                        } flex flex-row justify-between items-center w-[30%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] mx-[12px]`}
                    >
                        <div className={'text-[#808890]'}>Q-Claim</div>
                        <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                            {state.q_claim}
                            <span className={'text-[#EB2B3E]'}>USDT</span>
                            <ChevronDown size={18} className={'ml-1 mt-1'} />
                        </div>
                    </div>
                    <div
                        className={`${
                            tab == 6 ? 'hidden' : ''
                        } flex flex-row justify-between items-center w-[30%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] mx-[12px]`}
                    >
                        <div className={'text-[#808890]'}>Margin</div>
                        <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                            {state.margin}
                            <span className={'text-[#EB2B3E]'}>USDT</span>
                            <ChevronDown size={18} className={'ml-1 mt-1'} />
                        </div>
                    </div>
                </div>
            )}

            {
                //description
                index == 1 && (
                    <div className={'flex justify-center items-center mt-[24px]'}>
                        <CheckCircle />
                        <span className={'font-semibold text-[#22313F]'}>
                            {t('insurance:buy:saved')}
                            <span className={'text-[#EB2B3E]'}>1,000 USDT</span> {t('insurance:buy:sub_saved')}
                        </span>
                    </div>
                )
            }

            {/* the next level*/}
            {index == 1 && (
                <div className={'flex flex-col justify-center items-center mt-[146px]'}>
                    <Button
                        variants={'primary'}
                        className={`${
                            handleCheckValidate() ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                        }  h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                        disable={handleCheckValidate()}
                        onClick={() => {
                            if (!handleCheckValidate()) {
                                setIndex(2)
                            }
                        }}
                    >
                        {menu[11].name}
                    </Button>
                    <Button variants={'primary'} className={'my-[16px] text-[#00ABF9] underline'} onClick={() => {}}>
                        {menu[12].name}
                    </Button>
                </div>
            )}
            {index == 2 && (
                <AcceptBuyInsurance
                    state={state}
                    menu={menu}
                    checkUpgrade={checkUpgrade}
                    setCheckUpgrade={setCheckUpgrade}
                    handleCheckValidate={handleCheckValidate}
                />
            )}
        </LayoutInsurance>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'insurance'])),
    },
})

export default Insurance
