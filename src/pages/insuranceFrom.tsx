import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'

import useWeb3Wallet from 'hooks/useWeb3Wallet'
import Button from 'components/common/Button/Button'
import axios from 'axios'
import { Popover, Switch, Tab } from '@headlessui/react'
import { AcceptBuyInsurance } from '../components/screens/Insurance/AcceptBuyInsurance'
import { GetStaticProps } from 'next'
import { Input } from 'components/common/Input/input'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle, LeftArrow, InfoCircle, XMark, Dot } from 'components/common/Svg/SvgIcon'
import { ChevronDown, Check, ChevronUp } from 'react-feather'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'

//chart
const ChartComponent = dynamic(() => import('../components/common/Chart/chartComponent'), { ssr: false, loading: () => <header /> })

const InsuranceFrom = () => {
    const { t } = useTranslation()
    const wallet = useWeb3Wallet()
    const router = useRouter()
    const { width } = useWindowSize()
    const isMobile = width && width < screens.drawer
    const [percentInsurance, setPercentInsurance] = useState<number>(0)
    const [selectTime, setSelectTime] = useState<string>('ALL')
    const [isDrop, setDrop] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [checkUpgrade, setCheckUpgrade] = useState(false)
    const [clear, setClear] = useState(false)

    const [index, setIndex] = useState<1 | 2>(1)
    const [tab, setTab] = useState<number>(3)

    const [userBalance, setUserBalance] = useState<number>(0)
    const listCoin: ICoin[] = [
        {
            id: 1,
            name: 'Ethereum',
            icon: '/images/icons/ic_ethereum.png',
            symbol: 'ETHUSDT',
            type: 'ETH',
        },
        {
            id: 2,
            name: 'Bitcoin',
            icon: '/images/icons/ic_bitcoin.png',
            symbol: 'BTCUSDT',
            type: 'BTC',
        },
        {
            id: 3,
            name: 'Binance Coin ',
            icon: '/images/icons/ic_binance.png',
            disable: true,
            symbol: 'BNBUSDT',
            type: 'BNB',
        },
    ]

    const [state, setState] = useState({
        timeframe: '',
        margin: 0,
        percent_margin: 0,
        symbol: listCoin[0],
        period: 2,
        p_claim: 0,
        q_claim: 0,
        r_claim: 0,
        q_covered: 0,
        p_market: 0,
        t_market: new Date(),
        p_expired: 0,
    })

    const [dataChart, setDataChart] = useState()

    const [selectCoin, setSelectedCoin] = useState<ICoin>(listCoin[0])

    const [general, setGeneral] = useState<any>(null)

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

    const Leverage = (p_market: number, p_stop: number) => {
        const leverage = Number((p_market / Math.abs(p_market - p_stop)).toFixed(2))
        return leverage < 1 ? 1 : leverage
    }

    const P_stop = (p_market: number, p_claim: number, hedge: number) => {
        const diffStopfutures = 0 / 100
        const ratio_min_profit = Math.abs(p_claim - p_market) / p_market / 2
        if (p_claim > p_market) {
            const p_stop = Number(((p_market - p_market * (hedge + ratio_min_profit - diffStopfutures)) * 100).toFixed(2))
            return Math.abs(p_stop) / 100
        } else {
            const p_stop = Number(((p_market - p_market * (hedge + ratio_min_profit - diffStopfutures)) * 100).toFixed(2))
            return Math.abs(p_stop) / 100
        }
    }

    const validatePclaim = (value: number) => {
        let status: boolean = false

        if (
            (value > (2 * state.p_market) / 100 && value < (70 * state.p_market) / 100) ||
            (value > (-70 * state.p_market) / 100 && value < (-2 * state.p_market) / 100)
        ) {
            status = true
        }
        return status
    }

    useEffect(() => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        timeBegin.setDate(timeEnd.getDate() - 10)
        setState({ ...state, t_market: timeEnd })
        fetchApiNami(`${listCoin[0].symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1d', setDataChart)
        getPrice(listCoin[0].symbol, state, setState)
    }, [])

    useEffect(() => {
        refreshApi(selectTime, selectCoin)
        getPrice(selectCoin.symbol, state, setState)
    }, [selectTime, selectCoin])

    const refreshApi = (
        selectTime: string | undefined,
        selectCoin: { id?: number; name?: string; icon?: string; disable?: boolean | undefined; symbol: any },
    ) => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        if (selectTime == '1H' || selectTime == '1D') {
            timeBegin.setDate(timeEnd.getDate() - 10)
            fetchApiNami(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1m', setDataChart)
        } else if (selectTime == '1W') {
            timeBegin.setDate(timeEnd.getDate() - 10)
            fetchApiNami(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1h', setDataChart)
        } else {
            timeBegin.setDate(timeEnd.getDate() - 10)
            fetchApiNami(`${selectCoin.symbol}`, `${Math.floor(timeBegin.getTime() / 1000)}`, `${Math.ceil(timeEnd.getTime() / 1000)}`, '1h', setDataChart)
        }
    }

    useEffect(() => {
        if (state.q_covered) {
            const percent: number = Math.floor((state.q_covered / userBalance) * 100)
            setPercentInsurance(percent)
        }
        if (selectCoin) {
            setState({ ...state, symbol: selectCoin })
        }

        if (tab == 3) {
            if (state.period || state.q_covered || state.p_claim) {
                const margin = Number(((8 * state.q_covered * state.p_market) / 100).toFixed(2))
                const userCapital = margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number((margin / (state.q_covered * state.p_market)).toFixed(2))
                const p_stop = P_stop(state.p_market, state.p_claim, hedge)
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number((Math.abs(state.p_claim - state.p_market) / state.p_market).toFixed(2))
                const q_claim = Number((ratio_profit * hedge_capital * laverage).toFixed(2))
                setState({ ...state, q_claim: q_claim, r_claim: Number((q_claim / margin).toFixed(2)), p_expired: Math.floor(p_stop), margin: margin })
            }
        }

        if (tab == 6) {
            if (state.period || state.q_covered || state.p_claim || state.margin) {
                const userCapital = state.margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number((state.margin / (state.q_covered * state.p_market)).toFixed(2))
                const p_stop = P_stop(state.p_market, state.p_claim, hedge)
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number((Math.abs(state.p_claim - state.p_market) / state.p_market).toFixed(2))
                const q_claim = Number((ratio_profit * hedge_capital * laverage).toFixed(2))
                setState({ ...state, q_claim: q_claim, r_claim: Number((q_claim / state.margin).toFixed(2)), p_expired: Math.floor(p_stop) })
            }
        }
    }, [state.q_covered, state.period, selectCoin, state.margin, state.p_claim, state.percent_margin])

    //validate
    useEffect(() => {
        if (validatePclaim(state.p_claim)) {
            return setClear(true)
        }
    }, [state.p_claim])

    useEffect(() => {
        setUserBalance(wallet.getBalance())
        console.log(wallet)
    }, [wallet])
    return (
        <LayoutInsurance>
            {
                // head Insurance
                !isMobile && (
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
                                                (key == 3 || key == 6) && (
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
                )
            }

            {
                //title
                !isMobile ? (
                    <div className={'flex flex-col justify-center items-center mt-[20px] mb-[32px] '}>
                        <div>{index}/2</div>
                        <div className={'font-semibold text-[32px] leading-[44px]'}>{index == 1 ? menu[1].name : t('insurance:buy:info_covered')}</div>
                    </div>
                ) : (
                    index == 1 && (
                        <div className={`h-[32px] flex flex-row justify-between w-full items-center mx-[16px] mt-[24px] mb-[16px]`}>
                            <XMark />
                            <div className={`h-[32px] flex flex-row`}>
                                <span className={'text-[#00ABF9] underline hover:cursor-pointer pr-[16px] flex items-center'} onClick={() => {}}>
                                    {menu[12].name}
                                </span>
                                <div className="flex items-center">
                                    <Switch
                                        checked={tab == 6 ? true : false}
                                        onChange={() => {
                                            tab == 6 ? setTab(3) : setTab(6)
                                        }}
                                        className={`${
                                            tab == 6 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F4]'
                                        } relative inline-flex items-center h-[16px] rounded-full w-[32px] transition-colors shadow-sm`}
                                    >
                                        <span
                                            className={`${
                                                tab == 6 ? 'translate-x-[1.25rem] bg-[white]' : 'translate-x-1 bg-[#B2B7BC]'
                                            } inline-block w-[6px] h-[6px] transform bg-white rounded-full transition-transform text-white/[0]`}
                                        >
                                            {tab == 6 ? 'Enable' : 'Disable'}
                                        </span>
                                    </Switch>
                                    <span className="pl-[8px]">{t('insurance:buy:change')}</span>
                                </div>
                            </div>
                        </div>
                    )
                )
            }

            {
                //checkAuth
                wallet.accout == ''
                    ? !isMobile && (
                          <div className="ư-full flex justify-center items-center">
                              <Button
                                  variants={'primary'}
                                  className={`bg-[#EB2B3E] h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                  onClick={() => {}}
                              >
                                  {t('insurance:buy:connect_wallet')}
                              </Button>
                          </div>
                      )
                    : ''
            }
            {
                //chart
                index == 1 && (
                    <div
                        className={`${
                            !isMobile
                                ? 'shadow border border-1 border-[#E5E7E8] max-w-screen-layout m-auto h-auto pt-[20px] w-[100%] rounded-[12px] mt-[32px]'
                                : ''
                        }`}
                    >
                        {/*head*/}
                        {!isMobile ? (
                            <>
                                <div className={'pb-[8px] pl-[32px] pt-[32px] text-[14px] leading-5 text-[#808890] flex flex-row justify-start items-center'}>
                                    <div className={'w-1/2'}>{menu[7].name}</div>
                                    <div className={'w-1/2'}>{tab == 4 ? 'R-Claim' : tab == 5 ? 'Q-Claim' : tab == 6 && 'Margin'}</div>
                                </div>
                                <div className={'pb-[8px] pl-[32px] pr-[32px] h-[70px] flex justify-between'}>
                                    <div
                                        className={`${tab > 3 ? 'w-[50%] mr-[12px]' : 'w-full'} flex justify-between border-collapse rounded-[3px] shadow-none`}
                                    >
                                        <Input
                                            className={'w-[75%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'}
                                            type={'number'}
                                            inputName={'Loại tài sản và số lượng tài sản'}
                                            idInput={'iCoin'}
                                            value={state.q_covered && state.q_covered}
                                            onChange={(a: any) => {
                                                if (a.target.value > userBalance) {
                                                    return setState({ ...state, q_covered: userBalance })
                                                } else {
                                                    setState({ ...state, q_covered: a.target.value })
                                                }
                                                setPercentInsurance(0)
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
                                        <div
                                            className={`${
                                                tab > 3 ? 'w-[50%]' : 'hidden'
                                            } ml-[12px] flex justify-between border-collapse rounded-[3px] shadow-none`}
                                        >
                                            <Input
                                                className={
                                                    'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'
                                                }
                                                type={'number'}
                                                inputName={'P-Claim'}
                                                idInput={''}
                                                value={state.margin && state.margin}
                                                onChange={(a: any) => {
                                                    setState({ ...state, margin: a.target.value })
                                                }}
                                                placeholder={''}
                                            />
                                            <div
                                                className={
                                                    'bg-[#F7F8FA] w-[10%] shadow-none flex items-center justify-end px-[16px] select-none hover:cursor-pointer text-red'
                                                }
                                            >
                                                {'USDT'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-row w-full px-[0px]">
                                    <div className={`flex flex-row justify-between mt-[8px] ${tab == 6 ? 'w-1/2' : 'w-full'}`}>
                                        <div
                                            className={`flex flex-col justify-center w-[25%] items-center hover:cursor-pointer`}
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

                                    <div className={`flex flex-row justify-between mt-[8px] ${tab == 6 ? 'w-1/2' : 'hidden'}`}>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 2,
                                                    margin: Number(((state.percent_margin * state.q_covered * state.p_market) / 100).toFixed(2)),
                                                })
                                            }}
                                        >
                                            <div className={`${state.percent_margin == 2 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                            <span>2%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 5,
                                                    margin: Number(((state.percent_margin * state.q_covered * state.p_market) / 100).toFixed(2)),
                                                })
                                            }}
                                        >
                                            <div className={`${5 == state.percent_margin ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                            <span className={''}>5%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 7,
                                                    margin: Number(((state.percent_margin * state.q_covered * state.p_market) / 100).toFixed(2)),
                                                })
                                            }}
                                        >
                                            <div className={`${7 == state.percent_margin ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                            <span className={''}>7%</span>
                                        </div>
                                        <div
                                            className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    percent_margin: 10,
                                                    margin: Number(((state.percent_margin * state.q_covered * state.p_market) / 100).toFixed(2)),
                                                })
                                            }}
                                        >
                                            <div className={`${state.percent_margin == 10 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`} />
                                            <span>10%</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className=" my-[24px] w-full mx-auto flex flex-wrap flex-col justify-center content-center font-medium text-2xl">
                                <div>
                                    <span>{t('insurance:buy:buy_covered')} </span> <span className="text-[#EB2B3E]">{selectCoin.name}</span>
                                </div>
                                <div className="flex flex-row">
                                    <span className="pr-[4px]">{t('insurance:buy:quantity')} </span>{' '}
                                    <label className={`${state.q_covered == 0 ? 'text-[#B2B7BC]' : 'text-[#EB2B3E]'} max-w-[245] relative ml-[6xp]`}>
                                        {state.q_covered || 'Số tiền?'}
                                        <input
                                            type="number"
                                            className={` text-white pl-[4px] focus-visible:outline-none w-0 border border-1 border-black`}
                                            placeholder=""
                                            name="name"
                                            id="name"
                                            onChange={(a: any) => {
                                                if (a.target.value > userBalance) {
                                                    return setState({ ...state, q_covered: userBalance })
                                                } else {
                                                    setState({ ...state, q_covered: a.target.value })
                                                }
                                                setPercentInsurance(0)
                                            }}
                                        />
                                    </label>{' '}
                                    <span className="text-[#EB2B3E]">BNB</span>
                                </div>
                                {tab == 6 && (
                                    <div>
                                        <span>{t('insurance:buy:title_change_margin')}</span>{' '}
                                        <label className={`${state.q_covered == 0 ? 'text-[#B2B7BC]' : 'text-[#EB2B3E]'} max-w-[245] relative ml-[6xp]`}>
                                            {state.margin || 'Số tiền?'}
                                            <input
                                                type="number"
                                                className={` text-white pl-[4px] focus-visible:outline-none w-0 border border-1 border-black`}
                                                placeholder=""
                                                name="name"
                                                id="name"
                                                onChange={(a: any) => {
                                                    setState({
                                                        ...state,
                                                        margin: a.target.value,
                                                        percent_margin: a.target.value / (state.q_covered * state.p_market),
                                                    })
                                                }}
                                            />
                                        </label>{' '}
                                        <span className="text-[#EB2B3E]">USDT</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/*end head*/}

                        {/*body*/}
                        <div className={'pl-[32px] pr-[32px] flex flex-row relative'}>
                            <ChartComponent
                                data={dataChart}
                                state={state ? state : null}
                                p_claim={Number(state && state.p_claim)}
                                p_expired={state.p_expired > 0 ? state.p_expired : undefined}
                                setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                setP_Market={(data: number) => setState({ ...state, p_market: data })}
                            />
                            <svg className={`absolute right-[34px]`} width="10" height="458" viewBox="0 0 2 240" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                        {/*P-Claim*/}
                        {isMobile && (
                            <div className={'my-[24px] px-[32px]'}>
                                <span className={'flex flex-row items-center'}>
                                    P-Claim
                                    {
                                        <span
                                            className={'tooltip_p_claim relative'}
                                            onMouseEnter={() => setIsHover(true)}
                                            onMouseLeave={() => setIsHover(false)}
                                        >
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
                        )}

                        {/* Period */}
                        <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px]'}>
                            <span>Period ({menu[8].name})</span>
                            <Tab.Group>
                                <Tab.List className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'overflow-scroll w-full' : 'w-[85%]'}`}>
                                    {listTabPeriod.map((item, key) => {
                                        return (
                                            <div
                                                key={key}
                                                className={`${
                                                    state.period == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                    isMobile && !(item == 15) && 'mr-[24px]'
                                                }`}
                                                onClick={() => setState({ ...state, period: item })}
                                            >
                                                {item}
                                            </div>
                                        )
                                    })}
                                </Tab.List>
                            </Tab.Group>
                        </div>

                        {isMobile && tab == 6 && (
                            <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px]'}>
                                <span>Margin</span>
                                <Tab.Group>
                                    <Tab.List className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'overflow-scroll w-full' : 'w-[85%]'}`}>
                                        {[2, 5, 7, 10].map((item, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className={`${
                                                        state.percent_margin == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                    } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                        isMobile && !(item == 15) && 'mr-[24px]'
                                                    }`}
                                                    onClick={() =>
                                                        setState({
                                                            ...state,
                                                            percent_margin: item,
                                                            margin: Number(((item * state.q_covered * state.p_market) / 100).toFixed(2)),
                                                        })
                                                    }
                                                >
                                                    {item}%
                                                </div>
                                            )
                                        })}
                                    </Tab.List>
                                </Tab.Group>
                            </div>
                        )}

                        {/*P-Claim*/}
                        {!isMobile && (
                            <div className={'my-[24px] px-[32px]'}>
                                <span className={'flex flex-row items-center'}>
                                    P-Claim
                                    {
                                        <span
                                            className={'tooltip_p_claim relative'}
                                            onMouseEnter={() => setIsHover(true)}
                                            onMouseLeave={() => setIsHover(false)}
                                        >
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
                        )}
                    </div>
                )
            }

            {/*Only Show Claim And Margin*/}
            {index == 1 && !isMobile && (
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
                !isMobile && index == 1 && (
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
            {index == 1 && !isMobile && (
                <div className={`flex flex-col justify-center items-center mt-[146px]`}>
                    <button
                        className={`${
                            clear ? 'bg-red text-white border border-red' : 'text-white bg-[#E5E7E8] border border-[#E5E7E8]'
                        }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] px-[148px]`}
                        onClick={() => {
                            if (clear) {
                                setIndex(2)
                            }
                        }}
                        disabled={!clear}
                    >
                        {menu[11].name}
                    </button>

                    <span className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'} onClick={() => {}}>
                        {menu[12].name}
                    </span>
                </div>
            )}

            {index == 1 && isMobile && clear && (
                <>
                    <div className={'flex justify-center items-center mt-[24px]'}>
                        <CheckCircle />
                        <span className={'font-semibold text-[#22313F]'}>
                            {t('insurance:buy:saved')}
                            <span className={'text-[#EB2B3E]'}>1,000 USDT</span> {t('insurance:buy:sub_saved')}
                        </span>
                    </div>
                    <div className={'flex flex-col w-full mt-[24px] hover:cursor-default'}>
                        <div
                            className={`${
                                tab == 4 ? 'hidden' : ''
                            } flex flex-row justify-between items-center w-full rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                        >
                            <div className={'text-[#808890]'}>R-Claim</div>
                            <div className={'font-semibold'}>
                                {'   '}
                                <span>{state.r_claim}%</span>
                            </div>
                        </div>
                        <div
                            className={`${
                                tab == 5 ? 'hidden' : ''
                            } flex flex-row justify-between items-center w-full rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                        >
                            <div className={'text-[#808890]'}>Q-Claim</div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                {state.q_claim}
                                {'   '}
                                <span className={'text-[#EB2B3E]'}>USDT</span>
                            </div>
                        </div>
                        <div
                            className={`${
                                tab == 6 ? 'hidden' : ''
                            } flex flex-row justify-between items-center w-full rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                        >
                            <div className={'text-[#808890]'}>Margin</div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                {state.margin}
                                {'   '}
                                <span className={'text-[#EB2B3E]'}>USDT</span>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col justify-center items-center`}>
                        <button
                            className={`${
                                clear ? 'bg-red text-white border border-red' : 'text-white bg-[#E5E7E8] border border-[#E5E7E8]'
                            }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] px-[148px]`}
                            onClick={() => {
                                if (clear) {
                                    setIndex(2)
                                }
                            }}
                            disabled={!clear}
                        >
                            {menu[11].name}
                        </button>

                        <span className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'} onClick={() => {}}>
                            {menu[12].name}
                        </span>
                    </div>
                </>
            )}

            {index == 2 && (
                <AcceptBuyInsurance
                    state={state}
                    setState={setState}
                    menu={menu}
                    checkUpgrade={checkUpgrade}
                    setCheckUpgrade={setCheckUpgrade}
                    getPrice={getPrice}
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

export const fetchApiNami = async (symbol: string, from: string, to: string, resolution: string, setDataChart: any) => {
    try {
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
    } catch (err) {
        console.log(err)
    }
}

export const getPrice = async (symbol: string, state: any, setState: any) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${symbol}`)
        if (data) {
            if (data.data[0]) {
                console.log('fetch data', data.data[0]?.p)
                return setState({ ...state, p_market: data.data[0]?.p })
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export default InsuranceFrom