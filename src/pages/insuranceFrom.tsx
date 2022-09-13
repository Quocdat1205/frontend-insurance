import dynamic from 'next/dynamic'
import LayoutInsurance from 'components/layout/layoutInsurance'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import Button from 'components/common/Button/Button'
import axios from 'axios'
import { Menu, Popover, Switch, Tab } from '@headlessui/react'
import { AcceptBuyInsurance } from '../components/screens/Insurance/AcceptBuyInsurance'
import { GetStaticProps } from 'next'
import { Input } from 'components/common/Input/input'
import { ICoin } from 'components/common/Input/input.interface'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CheckCircle, LeftArrow, InfoCircle, XMark, ErrorTriggersIcon, BxDollarCircle, BxLineChartDown, BxCaledarCheck } from 'components/common/Svg/SvgIcon'
import { ChevronDown, Check, ChevronUp } from 'react-feather'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useWindowSize from 'hooks/useWindowSize'
import { screens } from 'utils/constants'
import { Suspense } from 'react'
import store from 'redux/store'
import Config from 'config/config'
import NotificationInsurance from 'components/layout/notifucationInsurance'
import { formatNumber } from 'utils/utils'
import Modal from 'components/common/Modal/Modal'
//chart
const ChartComponent = dynamic(() => import('../components/common/Chart/chartComponent'), { ssr: false, suspense: true })

export const InsuranceFrom = () => {
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
    const stone = store.getState()
    const [index, setIndex] = useState<1 | 2>(1)
    const [tab, setTab] = useState<number>(3)
    const [loadings, setLoadings] = useState(true)
    const [priceBNB, setPriceBNB] = useState(0)
    const [openChangeToken, setOpenChangeToken] = useState(false)
    const [active, setActive] = useState<boolean>(false)
    const [nameNoti, setNameNoti] = useState('loading')
    const [res, setRes] = useState<any>()
    const [showDetails, setShowDetails] = useState(false)
    const [unitMoney, setUnitMoney] = useState('USDT')
    const [showCroll, setShowCroll] = useState(false)
    const [showChangeUnit, setShowChangeUnit] = useState({
        isShow: false,
        name: '',
    })

    const [userBalance, setUserBalance] = useState<number>(0)
    const [listCoin, setListCoin] = useState<ICoin[]>([])
    const [selectCoin, setSelectedCoin] = useState<ICoin>({
        icon: 'https://sgp1.digitaloceanspaces.com/nami-dev/52ee9631-90f3-42e6-a05f-22ea01066e56-bnb.jpeg',
        id: '63187ae8c2ad72eac4d0f363',
        name: 'Binance',
        symbol: 'BNBUSDT',
        type: 'BNB',
    })
    const [state, setState] = useState({
        timeframe: '',
        margin: 0,
        percent_margin: 0,
        symbol: {
            icon: 'https://sgp1.digitaloceanspaces.com/nami-dev/52ee9631-90f3-42e6-a05f-22ea01066e56-bnb.jpeg',
            id: '63187ae8c2ad72eac4d0f363',
            name: 'Binance',
            symbol: 'BNBUSDT',
            type: 'BNB',
        },
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

    const listTerminology = [
        { name: 'Q-Covered', description: t('insurance:terminology:q_covered') },
        { name: 'P-Market', description: t('insurance:terminology:p_market') },
        { name: 'P-Claim', description: t('insurance:terminology:p_claim') },
        { name: 'P-Expired', description: t('insurance:terminology:p_expired') },
        { name: 'P-Refund', description: t('insurance:terminology:p_refund') },
        { name: 'Period', description: t('insurance:terminology:period') },
        { name: 'R-Claim', description: t('insurance:terminology:r_claim') },
        { name: 'Q-Claim', description: t('insurance:terminology:q_claim') },
        { name: 'Margin', description: t('insurance:terminology:margin') },
        { name: 'T-Start', description: t('insurance:terminology:t_start') },
        { name: 'T-Expired', description: t('insurance:terminology:t_expired') },
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
        if (wallet.account) {
            if (value > state.p_market + (2 * state.p_market) / 100 && value < state.p_market + (70 * state.p_market) / 100) {
                return setClear(true)
            } else if (value > state.p_market - (70 * state.p_market) / 100 && value < state.p_market - (2 * state.p_market) / 100) {
                return setClear(true)
            } else {
                return setClear(false)
            }
        }
    }

    useEffect(() => {
        setLoadings(true)
        if (stone.setting.assetsToken.length > 0) {
            let list: ICoin[] = []
            stone.setting.assetsToken.map(async (token: any) => {
                list.push({
                    id: token._id,
                    name: token.name,
                    icon: token.attachment,
                    symbol: `${token.symbol}USDT`,
                    type: token.symbol,
                })
            })
            setListCoin(list)
            setLoadings(false)
        }
        const data = localStorage.getItem('state')
        if (data) {
            const res = JSON.parse(data)
            setSelectedCoin({
                ...selectCoin,
                icon: res.symbol.icon,
                id: res.symbol.id,
                name: res.symbol.name,
                symbol: res.symbol.symbol,
                type: res.symbol.type,
            })
            setState({
                ...state,
                symbol: {
                    ...state.symbol,
                    icon: res.symbol.icon,
                    id: res.symbol.id,
                    name: res.symbol.name,
                    symbol: res.symbol.symbol,
                    type: res.symbol.type,
                },
            })
            setState({
                ...state,
                percent_margin: res.percent_margin,
                period: res.period,
                p_claim: res.p_claim,
                q_claim: res.q_claim,
                r_claim: res.r_claim,
                q_covered: res.q_covered,
            })

            if (res.tab) {
                setTab(res.tab)
            }
            if (res.unitMoney) {
                setUnitMoney(res.unitMoney || 'USDT')
            }
            if (res.index) {
                setIndex(res.index || 1)
            }
        }
        getPriceBNBUSDT(setPriceBNB)

        try {
            const result = wallet.getBalance()
            result.then((balance: number) => {
                const tmp = Number((balance * priceBNB) / state.p_market)
                console.log('connect success')
                setUserBalance(tmp)
            })
        } catch (error) {
            return console.log(error)
        }
    }, [stone])

    useEffect(() => {
        if (unitMoney) {
            const data = localStorage.getItem('state')
            if (data) {
                const res = JSON.parse(data)
                const newData = { ...res, unitMoney: unitMoney }
                localStorage.setItem('state', JSON.stringify(newData))
            }
        }
    }, [unitMoney])

    useEffect(() => {
        if (index) {
            const data = localStorage.getItem('state')
            if (data) {
                const res = JSON.parse(data)
                const newData = { ...res, index: index }
                localStorage.setItem('state', JSON.stringify(newData))
            }
        }
    }, [index])

    useEffect(() => {
        if (state.p_claim != 0) {
            validatePclaim(state.p_claim)
            const dataSave = { ...state, index: index, tab: tab }
            return localStorage.setItem('state', JSON.stringify(dataSave))
        }
    }, [state])

    useEffect(() => {
        const data = localStorage.getItem('state')
        if (data) {
            const res = JSON.parse(data)
            const newData = { ...res, tab: tab }
            return localStorage.setItem('state', JSON.stringify(newData))
        }
    }, [tab])

    useEffect(() => {
        if (listCoin.length > 0) {
            const timeEnd = new Date()
            const timeBegin = new Date()
            timeBegin.setDate(timeEnd.getDate() - 10)
            setState({ ...state, t_market: timeEnd })
            setLoadings(true)
            getPrice(listCoin[0].symbol, state, setState)
        }
    }, [listCoin])

    useEffect(() => {
        refreshApi(selectTime, selectCoin)
    }, [selectTime, selectCoin])

    useEffect(() => {
        if (selectCoin) {
            getPrice(selectCoin.symbol, state, setState)
        }
    }, [selectCoin])

    const refreshApi = (
        selectTime: string | undefined,
        selectCoin: { id?: string; name?: string; icon?: string; disable?: boolean | undefined; symbol: any },
    ) => {
        const timeEnd = new Date()
        const timeBegin = new Date()
        setLoadings(true)
        if (selectCoin) {
            if (selectTime == '1H' || selectTime == '1D') {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.symbol}`,
                    `${Math.floor(timeBegin.getTime() / 1000)}`,
                    `${Math.ceil(timeEnd.getTime() / 1000)}`,
                    '1m',
                    setDataChart,
                ).then(() => setLoadings(false))
            } else if (selectTime == '1W') {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.symbol}`,
                    `${Math.floor(timeBegin.getTime() / 1000)}`,
                    `${Math.ceil(timeEnd.getTime() / 1000)}`,
                    '1h',
                    setDataChart,
                ).then(() => setLoadings(false))
            } else {
                timeBegin.setDate(timeEnd.getDate() - 10)
                fetchApiNami(
                    `${selectCoin.symbol}`,
                    `${Math.floor(timeBegin.getTime() / 1000)}`,
                    `${Math.ceil(timeEnd.getTime() / 1000)}`,
                    '1h',
                    setDataChart,
                ).then(() => setLoadings(false))
            }
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
                const margin = Number((8 * state.q_covered * state.p_market) / 100)
                const userCapital = margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(state.p_market, state.p_claim, hedge)
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage)
                setState({ ...state, q_claim: q_claim, r_claim: Number(q_claim / margin), p_expired: Math.floor(p_stop), margin: margin })
            }
        }

        if (tab == 6) {
            if (state.period || state.q_covered || state.p_claim || state.margin) {
                const userCapital = state.margin
                const systemCapital = userCapital
                const hedge_capital = userCapital + systemCapital
                const hedge = Number(state.margin / (state.q_covered * state.p_market))
                const p_stop = P_stop(state.p_market, state.p_claim, hedge)
                const laverage = Leverage(state.p_market, p_stop)
                const ratio_profit = Number(Math.abs(state.p_claim - state.p_market) / state.p_market)
                const q_claim = Number(ratio_profit * hedge_capital * laverage)
                setState({ ...state, q_claim: q_claim, r_claim: Number(q_claim / state.margin), p_expired: Math.floor(p_stop) })
            }
        }
        validatePclaim(state.p_claim)
    }, [state.q_covered, state.period, selectCoin, state.margin, state.p_claim, state.percent_margin])

    useEffect(() => {}, [wallet])

    useEffect(() => {
        if (state.p_claim > 0) {
            validatePclaim(state.p_claim)
        }
    }, [state.p_claim])

    return !isMobile ? (
        !loadings && (
            <LayoutInsurance handleClick={() => setDrop(false)}>
                {active && (
                    <Modal
                        portalId="modal"
                        isVisible={!isMobile}
                        onBackdropCb={() => {}}
                        className="rounded-xl p-6 bg-white max-w-[424px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <NotificationInsurance
                            id={res ? res.data._id : ''}
                            name={'loading'}
                            state={state}
                            active={active}
                            setActive={() => {
                                setActive(false)
                            }}
                            isMobile={false}
                        />
                    </Modal>
                )}
                {showDetails && (
                    <Modal
                        portalId="modal"
                        isVisible={true}
                        onBackdropCb={() => {}}
                        className="rounded-xl p-6 bg-white max-w-[424px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className={` bg-white text-sm  w-[424px] mx-auto `}>
                            <div
                                className="m-[24px] flex flex-row-reverse"
                                onClick={() => {
                                    setShowDetails(false)
                                }}
                            >
                                <XMark></XMark>
                            </div>
                            <div className="flex flex-col justify-center items-center my-[24px]">
                                <div className="font-medium text-xl">{t('insurance:buy:detailed_terminology')}</div>
                                <div className="mt-[32px] divide-y divide-[#E5E7E8] text-[#22313F]">
                                    {listTerminology.map((item, key) => {
                                        return (
                                            <div key={key} className="w-[380px] flex flex-row justify-between items-center">
                                                <span className="py-[24px]">{item.name}</span>
                                                <span className="text-left w-[160px] py-[12px]">{item.description}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

                {
                    // head Insurance
                    <div className="max-w-screen-layout mx-auto px-[80px] mt-[48px] mb-[20px] flex items-center justify-between" onClick={() => setDrop(false)}>
                        <div className="flex items-center font-semibold text-base">
                            <LeftArrow></LeftArrow>
                            <span
                                className={' text-[#22313F] hover:cursor-pointer'}
                                onClick={() => {
                                    if (index == 1) {
                                        return router.push('/ ')
                                    }
                                    if (index == 2) {
                                        return setIndex(1)
                                    }
                                }}
                            >
                                {menu[2].name}
                            </span>
                        </div>

                        <Popover className="relative">
                            <Popover.Button
                                className={
                                    'border border-[0.5] text-base border-[#F7F8FA] rounded-[6px] h-[40px] w-auto py-[8px] px-[12px] flex flex-row bg-[#F7F8FA] shadow focus-visible:outline-none'
                                }
                                onClick={() => setDrop(!isDrop)}
                            >
                                {menu[tab]?.name}
                                {!isDrop ? <ChevronDown></ChevronDown> : <ChevronUp></ChevronUp>}
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
                                                        className={`${Press ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'}
                                                        flex flex-row justify-start w-full items-center p-3 font-medium hover:cursor-pointer`}
                                                    >
                                                        <div className={`flex flex-row justify-between w-full px-[16px] py-[6px] `}>
                                                            <span> {e.name} </span>
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

                    <div className={'flex flex-col justify-center items-center mb-[32px] '} onClick={() => setDrop(false)}>
                        <div>{index}/2</div>
                        <div className={'font-semibold text-[32px] leading-[44px]'}>{index == 1 ? menu[1].name : t('insurance:buy:info_covered')}</div>
                        {!wallet.account && <div className={'mt-[12px]'}>{t('insurance:buy:connect_wallet_error')}</div>}
                    </div>
                }

                {
                    //checkAuth
                    !wallet.account
                        ? !isMobile && (
                              <div className="w-full flex flex-col justify-center items-center" onClick={() => setDrop(false)}>
                                  <Button
                                      variants={'primary'}
                                      className={`bg-[#EB2B3E] h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                      onClick={() => {
                                          Config.connectWallet()
                                      }}
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
                            className={`${!isMobile ? 'shadow border border-1 border-[#E5E7E8] max-w-6xl m-auto h-auto rounded-[12px] mt-[32px]' : ''}`}
                            onClick={() => setDrop(false)}
                        >
                            {/*head*/}

                            <div
                                className={
                                    'max-w-screen-layout pb-[8px] pl-[32px] pt-[32px] text-[14px] leading-5 text-[#808890] flex flex-row justify-start items-center'
                                }
                            >
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
                                        value={state.q_covered.toFixed(8) || 0}
                                        onChange={(a: any) => {
                                            if (a.target.value > userBalance) {
                                                setState({ ...state, q_covered: userBalance })
                                            } else {
                                                setState({ ...state, q_covered: a.target.value })
                                            }
                                            setPercentInsurance(0)
                                        }}
                                        placeholder={'0'}
                                    ></Input>
                                    <Popover className="relative w-[25%] outline-none bg-[#F7F8FA] focus:ring-0 rounded-none shadow-none flex items-center justify-center pr-[21px]">
                                        <Popover.Button
                                            id={'popoverInsurance'}
                                            className={'flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0'}
                                        >
                                            <img alt={''} src={`${selectCoin.icon}`} width="36" height="36" className={'mr-[4px]'}></img>
                                            <span className={'w-[104px] flex flex-start font-semibold text-[#EB2B3E] text-base'}>
                                                {selectCoin && selectCoin.name}
                                            </span>
                                            <ChevronDown size={18} className={'mt-1 text-[#22313F]'}></ChevronDown>
                                        </Popover.Button>
                                        <Popover.Panel className="absolute z-50 bg-white top-[78px] right-0  w-[360px] rounded shadow">
                                            {({ close }) => (
                                                <div className="flex flex-col focus:border-0 focus:ring-0 active:border-0">
                                                    {listCoin &&
                                                        listCoin.map((coin, key) => {
                                                            let isPress = false
                                                            // @ts-ignore
                                                            return !coin.disable ? (
                                                                <div
                                                                    id={`${coin.id}`}
                                                                    key={key}
                                                                    onMouseDown={() => (isPress = true)}
                                                                    onMouseUp={() => {
                                                                        isPress = false
                                                                        setSelectedCoin(coin)
                                                                        setState({ ...state, symbol: { ...coin } })
                                                                    }}
                                                                    onClick={() => close()}
                                                                    className={`${
                                                                        isPress ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'
                                                                    } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                                >
                                                                    <img alt={''} src={`${coin.icon}`} width="36" height="36" className={'mr-[5px]'}></img>
                                                                    <div className={'flex flex-row justify-between w-full'}>
                                                                        <span className={'hover:cursor-default'}>{coin.name}</span>
                                                                        {coin.id === selectCoin.id ? (
                                                                            <Check size={18} className={'text-[#EB2B3E]'}></Check>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                    </div>
                                                                </div>
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
                                                                    ></img>
                                                                    <div className={'flex flex-row justify-between w-full'}>
                                                                        <span>{coin.name}</span>
                                                                        {coin.id === selectCoin.id ? (
                                                                            <Check size={18} className={'text-[#EB2B3E]'}></Check>
                                                                        ) : (
                                                                            ''
                                                                        )}
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
                                        className={`${tab > 3 ? 'w-[50%]' : 'hidden'} ml-[12px] flex justify-between border-collapse rounded-[3px] shadow-none`}
                                    >
                                        <Input
                                            className={'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none'}
                                            type={'number'}
                                            inputName={'P-Claim'}
                                            idInput={''}
                                            value={(state.margin && state.margin.toFixed(8)) || 0}
                                            onChange={(a: any) => {
                                                setState({ ...state, margin: a.target.value, percent_margin: 0 })
                                            }}
                                            placeholder={''}
                                        ></Input>
                                        <div
                                            className={
                                                'bg-[#F7F8FA] w-[10%] shadow-none flex flex-row items-center justify-end px-[16px] select-none hover:cursor-pointer text-red'
                                            }
                                        >
                                            <span>{unitMoney}</span>
                                            <div className="relative">
                                                <Menu>
                                                    <Menu.Button className={'my-[16px] text-[#22313F] underline hover:cursor-pointer '}>
                                                        <ChevronDown></ChevronDown>
                                                    </Menu.Button>
                                                    <Menu.Items
                                                        className={'flex flex-col text-[#22313F] absolute z-50 top-[63px] right-[-15px] bg-white rounded'}
                                                        style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                                    >
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA]`}
                                                                    onClick={() => {
                                                                        setUnitMoney('USDT')
                                                                    }}
                                                                >
                                                                    <span>USDT</span>
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={`${
                                                                        active && 'bg-blue-500'
                                                                    }  py-[8px] px-[16px]  hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                                    onClick={() => {
                                                                        setUnitMoney('BUSD')
                                                                    }}
                                                                >
                                                                    <span>BUSD</span>
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    className={`${
                                                                        active && 'bg-blue-500'
                                                                    }  py-[8px] px-[16px]  hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                                    onClick={() => {
                                                                        setUnitMoney('USDC')
                                                                    }}
                                                                >
                                                                    <span>USDC</span>
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Menu>
                                            </div>
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
                                        <div className={`${percentInsurance == 25 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                        <span>25%</span>
                                    </div>
                                    <div
                                        className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                        onClick={() => setState({ ...state, q_covered: (50 / 100) * userBalance })}
                                    >
                                        <div className={`${50 == percentInsurance ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                        <span className={''}>50%</span>
                                    </div>
                                    <div
                                        className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                        onClick={() => setState({ ...state, q_covered: (75 / 100) * userBalance })}
                                    >
                                        <div className={`${75 == percentInsurance ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                        <span className={''}>75%</span>
                                    </div>
                                    <div
                                        className={'flex flex-col justify-center w-[25%] items-center hover:cursor-pointer'}
                                        onClick={() => setState({ ...state, q_covered: userBalance })}
                                    >
                                        <div className={`${percentInsurance == 100 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
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
                                        <div className={`${state.percent_margin == 2 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
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
                                        <div className={`${5 == state.percent_margin ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
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
                                        <div className={`${7 == state.percent_margin ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
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
                                        <div className={`${state.percent_margin == 10 ? 'bg-[#EB2B3E]' : 'bg-[#F2F3F5]'} h-[5px] w-[80%] rounded-sm`}></div>
                                        <span>10%</span>
                                    </div>
                                </div>
                            </div>

                            {/*end head*/}

                            {/*body*/}
                            <div className={'px-[32px] flex flex-row relative'}>
                                <Suspense fallback={`Loading...`}>
                                    <ChartComponent
                                        data={dataChart}
                                        state={state ? state : null}
                                        p_claim={Number(state && state.p_claim)}
                                        p_expired={state.p_expired > 0 ? state.p_expired : undefined}
                                        setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                        setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                    ></ChartComponent>
                                </Suspense>
                                <svg
                                    className={`absolute lg:right-[34px] right-[0px]`}
                                    width="10"
                                    height="auto"
                                    viewBox="0 0 2 240"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="1" y1="3.5011e-08" x2="0.999987" y2="240" stroke="#B2B7BC" strokeWidth="150" strokeDasharray="0.74 3.72"></line>
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
                                            className={`${
                                                selectTime == time ? 'text-[#EB2B3E]' : 'text-[#808890]'
                                            } hover:cursor-pointer font-medium  text-base`}
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
                            {
                                <div className={'my-[24px] px-[32px] text-sm text-[#808890]'}>
                                    <span className={'flex flex-row items-center mr-[4px]'}>
                                        P-Claim
                                        {
                                            <span
                                                className={'tooltip_p_claim relative'}
                                                onMouseEnter={() => setIsHover(true)}
                                                onMouseLeave={() => setIsHover(false)}
                                            >
                                                <InfoCircle></InfoCircle>
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
                                    <div
                                        className={`mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none text-base ${
                                            !clear && 'border border-1 border-red'
                                        }`}
                                    >
                                        <Input
                                            className={'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none '}
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
                                        ></Input>
                                        <div className={'bg-[#F7F8FA] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>{unitMoney}</div>
                                    </div>
                                    {!clear && state.p_claim != 0 && (
                                        <span className="flex flex-row text-[#E5544B] mt-[8px]">
                                            <ErrorTriggersIcon /> <span className="pl-[6px]">{t('insurance:error:p_claim')}</span>
                                        </span>
                                    )}
                                </div>
                            }

                            {/* Period */}
                            <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-[#808890]'}>
                                <span>Period ({menu[8].name})</span>
                                <Tab.Group>
                                    <Tab.List
                                        className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'w-full' : 'w-[85%]'} ${
                                            isMobile && showCroll ? 'overflow-scroll' : ' overflow-hidden'
                                        }`}
                                        onTouchStart={() => {
                                            setShowCroll(true)
                                        }}
                                        onTouchEnd={() => {
                                            setShowCroll(false)
                                        }}
                                    >
                                        {listTabPeriod.map((item, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className={`${
                                                        state.period == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                    } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                        isMobile && !(item == 15) && 'mr-[12px]'
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
                        </div>
                    )
                }

                {/*Only Show Claim And Margin*/}
                {index == 1 && (
                    <div className={'max-w-6xl m-auto flex flex-row justify-center items-center mt-[24px] hover:cursor-default'} onClick={() => setDrop(false)}>
                        <div
                            className={`${
                                tab == 4 ? 'hidden' : ''
                            } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px]`}
                        >
                            <div className={'text-[#808890]'}>R-Claim</div>
                            <div className={'font-semibold'}>
                                <span>{state.r_claim.toFixed(2) || 0}%</span>
                            </div>
                        </div>
                        <div
                            className={`${
                                tab == 5 ? 'hidden' : ''
                            } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] mx-[12px]`}
                        >
                            <div className={'text-[#808890]'}>Q-Claim</div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                {state.q_claim.toFixed(8) || 0}
                                <span className={'text-[#EB2B3E] pl-[8px]'}>{unitMoney}</span>
                                <Menu>
                                    <Menu.Button className={'text-[#22313F] underline hover:cursor-pointer '}>
                                        <ChevronDown></ChevronDown>
                                    </Menu.Button>
                                    <Menu.Items
                                        className={'flex flex-col text-[#22313F] absolute z-50 top-[28px] right-[5px] bg-white rounded'}
                                        style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                    >
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA]`}
                                                    onClick={() => {
                                                        setUnitMoney('USDT')
                                                    }}
                                                >
                                                    <span>USDT</span>
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                    onClick={() => {
                                                        setUnitMoney('BUSD')
                                                    }}
                                                >
                                                    <span>BUSD</span>
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                    onClick={() => {
                                                        setUnitMoney('USDC')
                                                    }}
                                                >
                                                    <span>USDC</span>
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        </div>
                        <div
                            className={`${
                                tab == 6 ? 'hidden' : ''
                            } flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-[#E5E7E8] border-0.5 px-[24px] py-[16px] `}
                        >
                            <div className={'text-[#808890]'}>Margin</div>
                            <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                {state.margin.toFixed(8) || 0}
                                <span className={'text-[#EB2B3E] pl-[8px]'}>{unitMoney}</span>
                                <Menu>
                                    <Menu.Button className={' text-[#22313F] underline hover:cursor-pointer '}>
                                        <ChevronDown></ChevronDown>
                                    </Menu.Button>
                                    <Menu.Items
                                        className={'flex flex-col text-[#22313F] absolute z-50 top-[28px] right-[5px] bg-white rounded'}
                                        style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                    >
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA]`}
                                                    onClick={() => {
                                                        setUnitMoney('USDT')
                                                    }}
                                                >
                                                    <span>USDT</span>
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                    onClick={() => {
                                                        setUnitMoney('BUSD')
                                                    }}
                                                >
                                                    <span>BUSD</span>
                                                </a>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    className={`${active && 'bg-blue-500'}  py-[8px] px-[16px]  hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                                    onClick={() => {
                                                        setUnitMoney('USDC')
                                                    }}
                                                >
                                                    <span>USDC</span>
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        </div>
                    </div>
                )}

                {
                    //description
                    index == 1 && (
                        <div className={'flex justify-center items-center mt-[24px]'} onClick={() => setDrop(false)}>
                            <CheckCircle></CheckCircle>
                            <span className={'font-semibold text-[#22313F] px-[4px]'}>
                                {`${t('insurance:buy:saved')} `}
                                <span className={'text-[#EB2B3E]'}>1,000 {unitMoney}</span> {t('insurance:buy:sub_saved')}
                            </span>
                        </div>
                    )
                }

                {/* the next level*/}
                {index == 1 && (
                    <div className={`flex flex-col justify-center items-center my-[48px]`} onClick={() => setDrop(false)}>
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
                        <Menu>
                            <Menu.Button className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}>{menu[12].name}</Menu.Button>
                            <Menu.Items
                                className={'flex flex-col text-[#22313F]'}
                                style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            className={`${active && 'bg-blue-500'}  py-[8px] pl-[16px] w-[300px] hover:bg-[#F7F8FA]`}
                                            href="https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/"
                                        >
                                            <span>{t('insurance:buy:help1')}</span>
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            className={`${active && 'bg-blue-500'}  py-[8px] pl-[16px] w-[300px] hover:bg-[#F7F8FA] hover:cursor-pointer`}
                                            onClick={() => {
                                                setShowDetails(true)
                                            }}
                                        >
                                            <span>{t('insurance:buy:detailed_terminology')}</span>
                                        </a>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                )}
                {index == 2 && (
                    <AcceptBuyInsurance
                        state={state}
                        setState={setState}
                        menu={menu}
                        checkUpgrade={checkUpgrade}
                        setCheckUpgrade={setCheckUpgrade}
                        getPrice={getPrice}
                        handelSetActive={setActive}
                        setNoti={setNameNoti}
                        setRes={setRes}
                        setIndex={setIndex}
                    ></AcceptBuyInsurance>
                )}
            </LayoutInsurance>
        )
    ) : (
        <>
            {!wallet.account ? (
                <>
                    {showDetails && (
                        <Modal
                            portalId="modal"
                            isVisible={true}
                            onBackdropCb={() => {}}
                            className="rounded-xl p-6 bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className={` bg-white text-sm  mx-auto `}>
                                <div
                                    className="mt-[32px] mx-[24px] flex flex-row-reverse"
                                    onClick={() => {
                                        setShowDetails(false)
                                    }}
                                >
                                    <XMark></XMark>
                                </div>
                                <div className="flex flex-col justify-center items-center my-[24px]">
                                    <div className="font-medium text-xl">{t('insurance:buy:detailed_terminology')}</div>
                                    <div className="mt-[32px] divide-y divide-[#E5E7E8] text-[#22313F]">
                                        {listTerminology.map((item, key) => {
                                            return (
                                                <div key={key} className="w-[380px] flex flex-row justify-between items-center">
                                                    <span className="py-[24px]">{item.name}</span>
                                                    <span className="text-left w-[160px] py-[12px]">{item.description}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )}
                    <div style={{ background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.15) 0%, rgba(254, 205, 211, 0) 100%)' }}>
                        <div className="px-[16px] pt-[8px]" onClick={() => router.push('/home')}>
                            <XMark />
                        </div>
                        <div className="flex flex-col items-center px-[60px] pt-[8px]">
                            <img src={'/images/buyInsurance.png'} width="269" height="212" className="w-[269px] h-auto" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center pt-[16px] text-[#22313F]">
                        <span className="text-xl font-semibold ">Nami Insurance</span>
                        <span>
                            {t('insurance:mobile_login:sub_title1')} - {t('insurance:mobile_login:sub_title2')}
                        </span>
                    </div>
                    <div className="px-[24px] flex flex-col justify-center mt-[32px] mb-[49px]">
                        <div className="flex flex-row">
                            <div className="pr-[16px]">
                                <BxDollarCircle />
                            </div>
                            <div className="flex flex-col pr-[7px]">
                                <span className="text-[#22313F] text-sm font-semibold">{t('insurance:mobile_login:token')}</span>
                                <span className="text-sm text-[#808890]">{t('insurance:mobile_login:token_detail')}</span>
                            </div>
                        </div>
                        <div className="flex flex-row my-[24px]">
                            <div className="pr-[16px]">
                                <BxLineChartDown />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#22313F] text-sm font-semibold">{t('insurance:mobile_login:p_claim')}</span>
                                <span className="text-sm text-[#808890]">{t('insurance:mobile_login:p_claim_detail')}</span>
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="pr-[16px]">
                                <BxCaledarCheck />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#22313F] text-sm font-semibold">{t('insurance:mobile_login:period')}</span>
                                <span className="text-sm text-[#808890]">{t('insurance:mobile_login:period_detial')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mb-[16px]">
                        <Button
                            variants={'primary'}
                            className={`bg-[#EB2B3E] text-sm font-semibold h-[48px] w-[95%] tiny:w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                            onClick={() => {
                                Config.connectWallet()
                            }}
                        >
                            {t('insurance:mobile_login:connect_wallet')}
                        </Button>
                    </div>
                    <div
                        className={` hover:cursor-pointer flex justify-center text-[#EB2B3E] text-[14px] line-height-[19px] underline`}
                        onClick={() => {
                            setShowDetails(true)
                        }}
                    >
                        <span>{t('insurance:buy:detailed_terminology')}</span>
                    </div>
                </>
            ) : (
                <>
                    {showChangeUnit.isShow && (
                        <Modal portalId="modal" isVisible={true} onBackdropCb={() => {}} className=" p-6 bg-white absolute bottom-0">
                            <div className={` bg-white text-sm  mx-auto `}>
                                <div
                                    className="mt-[32px] mx-[24px] flex flex-row-reverse"
                                    onClick={() => {
                                        setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })
                                    }}
                                >
                                    <XMark></XMark>
                                </div>
                                <div className="flex flex-col justify-center items-center my-[24px]">
                                    <div className="font-medium text-xl">{showChangeUnit.name}</div>
                                    <div className="mt-[32px] divide-y divide-[#E5E7E8] text-[#22313F]">
                                        {['USDT', 'USDC', 'BUSD'].map((item, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className="w-[380px] flex flex-row justify-between items-center"
                                                    onClick={() => {
                                                        setUnitMoney(item)
                                                        setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })
                                                    }}
                                                >
                                                    <span className="py-[24px]">{item}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    )}
                    {openChangeToken && (
                        <div className="absolute w-full h-full bg-gray/[0.5] z-50 flex flex-col-reverse">
                            <div className="bg-white h-[50%] w-full flex flex-col z-50">
                                <div
                                    className="m-[24px] flex flex-row-reverse"
                                    onClick={() => {
                                        setOpenChangeToken(false)
                                    }}
                                >
                                    <XMark></XMark>
                                </div>
                                <div className="m-[24px] font-semibold text-xl">{t('insurance:buy:asset')}</div>
                                {listCoin &&
                                    listCoin.map((coin, key) => {
                                        let isPress = false

                                        // @ts-ignore
                                        return !coin.disable ? (
                                            <div
                                                id={`${coin.id}`}
                                                key={key}
                                                onMouseDown={() => (isPress = true)}
                                                onMouseUp={() => {
                                                    isPress = false
                                                    setSelectedCoin(coin)
                                                    setState({ ...state, symbol: { ...coin } })
                                                    setOpenChangeToken(false)
                                                }}
                                                className={`${
                                                    isPress ? 'bg-[#F2F3F5]' : 'hover:bg-[#F7F8FA]'
                                                } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                            >
                                                <img alt={''} src={`${coin.icon}`} width="36" height="36" className={'mr-[5px]'}></img>
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    <span className={'hover:cursor-default'}>{coin.name}</span>
                                                    {coin.id === selectCoin.id ? <Check size={18} className={'text-[#EB2B3E]'}></Check> : ''}
                                                </div>
                                            </div>
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
                                                ></img>
                                                <div className={'flex flex-row justify-between w-full'}>
                                                    <span>{coin.name}</span>
                                                    {coin.id === selectCoin.id ? <Check size={18} className={'text-[#EB2B3E]'}></Check> : ''}
                                                </div>
                                            </a>
                                        )
                                    })}
                            </div>
                        </div>
                    )}
                    {
                        <Modal
                            portalId="modal"
                            isVisible={active}
                            onBackdropCb={() => {}}
                            className="rounded-xl p-6 bg-white max-w-[424px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <NotificationInsurance
                                id={res ? res.data._id : ''}
                                name={'loading'}
                                state={state}
                                active={active}
                                setActive={() => {
                                    setActive(false)
                                }}
                                isMobile={true}
                            />
                        </Modal>
                    }
                    {index == 1 && (
                        <div className={`h-[32px] flex flex-row justify-between items-center mx-[16px] mt-[24px] mb-[16px]`}>
                            <div
                                onClick={() => {
                                    router.push('/home')
                                }}
                            >
                                <XMark></XMark>
                            </div>
                            <div className={`h-[32px] flex flex-row mx-[16px]`}>
                                <span
                                    className={'text-[#00ABF9] underline hover:cursor-pointer pr-[16px] flex items-center'}
                                    onClick={() => {
                                        router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                                    }}
                                >
                                    {t('insurance:buy:help_short')}
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
                    )}

                    {index == 1 && (
                        <div className=" my-[24px] w-full mx-auto flex flex-wrap flex-col justify-center content-center font-medium text-2xl relative">
                            <div>
                                <span>{t('insurance:buy:buy_covered')} </span>{' '}
                                <span
                                    className="text-[#EB2B3E]"
                                    onClick={() => {
                                        setOpenChangeToken(true)
                                    }}
                                >
                                    {selectCoin.name}
                                </span>
                            </div>
                            <div className="flex flex-row overflow-clip">
                                <span className="pr-[4px]">{t('insurance:buy:quality')} </span>{' '}
                                <label className={`${state.q_covered == 0 ? 'text-[#B2B7BC]' : 'text-[#EB2B3E]'} max-w-[245] relative ml-[6xp] `}>
                                    {state.q_covered > 0 ? state.q_covered.toFixed(8) : 'Số tiền?'}
                                    <input
                                        type="number"
                                        className={` text-white pl-[4px] focus-visible:outline-none w-0 border border-1 border-black ${
                                            openChangeToken && 'opacity-0'
                                        } `}
                                        placeholder=""
                                        name="name"
                                        id="name"
                                        onChange={(a: any) => {
                                            if (a.target.value > userBalance) {
                                                setState({ ...state, q_covered: userBalance })
                                            } else {
                                                setState({ ...state, q_covered: a.target.value })
                                            }
                                            setPercentInsurance(0)
                                        }}
                                    ></input>
                                </label>{' '}
                                <span className="text-[#EB2B3E]">BNB</span>
                            </div>
                            {tab == 6 && (
                                <div>
                                    <span>{t('insurance:buy:title_change_margin')}</span>{' '}
                                    <label className={`${state.q_covered == 0 ? 'text-[#B2B7BC]' : 'text-[#EB2B3E]'} max-w-[245] relative ml-[6xp]`}>
                                        {state.margin.toFixed(8) || 'Số tiền?'}
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
                                        ></input>
                                    </label>{' '}
                                    <span
                                        className="text-[#EB2B3E]"
                                        onClick={() => setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })}
                                    >
                                        {unitMoney}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                    {index == 1 && (
                        <>
                            <div className={' flex flex-row relative'}>
                                <Suspense fallback={`Loading...`}>
                                    <ChartComponent
                                        data={dataChart}
                                        state={state ? state : null}
                                        p_claim={Number(state && state.p_claim)}
                                        p_expired={state.p_expired > 0 ? state.p_expired : undefined}
                                        setP_Claim={(data: number) => setState({ ...state, p_claim: data })}
                                        setP_Market={(data: number) => setState({ ...state, p_market: data })}
                                        isMobile={isMobile}
                                    ></ChartComponent>
                                </Suspense>
                                <svg
                                    className={`absolute lg:right-[34px] right-[0px]`}
                                    width="10"
                                    height="100%"
                                    viewBox="0 0 2 240"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="1" y1="3.5011e-08" x2="0.999987" y2="240" stroke="#B2B7BC" strokeWidth="150" strokeDasharray="0.74 3.72"></line>
                                </svg>
                            </div>
                            <div className={'flex flex-row justify-between items-center w-full mt-5 pl-[32px] pr-[32px]'}>
                                {listTime.map((time, key) => {
                                    return (
                                        <div
                                            key={key}
                                            className={`${
                                                selectTime == time ? 'text-[#EB2B3E]' : 'text-[#808890]'
                                            } hover:cursor-pointer font-medium  text-base`}
                                            onClick={() => {
                                                setSelectTime(time)
                                            }}
                                        >
                                            {time}
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                    {/* Period */}
                    {index == 1 && (
                        <div className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-[#808890]'}>
                            <span>Period ({menu[8].name})</span>
                            <Tab.Group>
                                <Tab.List
                                    className={`flex flex-row justify-between mt-[20px]  ${isMobile ? 'w-full' : 'w-[85%]'} ${
                                        isMobile && showCroll ? 'overflow-scroll' : ' overflow-hidden'
                                    }`}
                                    onTouchStart={() => {
                                        setShowCroll(true)
                                    }}
                                    onTouchEnd={() => {
                                        setShowCroll(false)
                                    }}
                                >
                                    {listTabPeriod.map((item, key) => {
                                        return (
                                            <div
                                                key={key}
                                                className={`${
                                                    state.period == item && 'bg-[#FFF1F2] text-[#EB2B3E]'
                                                } bg-[#F7F8FA] rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
                                                    isMobile && !(item == 15) && 'mr-[12px]'
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
                    )}

                    {index == 1 && (
                        <div className={'my-[24px] px-[32px]'}>
                            <span className={'flex flex-row items-center '}>
                                <span className={'text-[#808890] text-sm mr-[4px]'}>P-Claim</span>
                                {
                                    <span className={'tooltip_p_claim relative'} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                                        <InfoCircle></InfoCircle>
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
                            <div
                                className={`mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none ${!clear && 'border border-1 border-red'}`}
                            >
                                <Input
                                    className={'w-[90%] font-semibold appearance-none bg-[#F7F8FA] outline-none focus:ring-0 rounded-none shadow-none '}
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
                                ></Input>
                                <div className={'bg-[#F7F8FA] text-[#B2B7BC] w-[10%] shadow-none flex items-center justify-end px-[16px]'}>{unitMoney}</div>
                            </div>
                        </div>
                    )}
                    {tab == 6 && (
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
                    {index == 1 && clear && (
                        <div onClick={() => setDrop(false)}>
                            <div className={'flex justify-center items-center mt-[24px]'}>
                                <CheckCircle></CheckCircle>
                                <span className={'text-sm text-[#22313F] px-[4px]'}>
                                    {t('insurance:buy:saved')}
                                    <span className={'text-[#EB2B3E]'}>1,000 {unitMoney}</span> {t('insurance:buy:sub_saved')}
                                </span>
                            </div>
                            <div className={'flex flex-col  mt-[24px] hover:cursor-default'}>
                                <div
                                    className={`${
                                        tab == 4 ? 'hidden' : ''
                                    } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                >
                                    <div className={'text-[#808890]'}>R-Claim</div>
                                    <div className={'font-semibold'}>
                                        <span>{state.r_claim.toFixed(2) || 0}%</span>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        tab == 5 ? 'hidden' : ''
                                    } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                >
                                    <div className={'text-[#808890]'}>Q-Claim</div>
                                    <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                        {state.q_claim.toFixed(8) || 0}
                                        <span
                                            className={'text-[#EB2B3E] pl-[8px]'}
                                            onClick={() => setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:q_claim')}` })}
                                        >
                                            {unitMoney}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        tab == 6 ? 'hidden' : ''
                                    } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[16px] mx-[12px]`}
                                >
                                    <div className={'text-[#808890]'}>Margin</div>
                                    <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                        {state.margin.toFixed(8) || 0}

                                        <span
                                            className={'text-[#EB2B3E] pl-[8px]'}
                                            onClick={() => setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })}
                                        >
                                            {unitMoney}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex flex-col justify-center items-center mb-[32px]`}>
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
                            </div>
                        </div>
                    )}
                    {index == 2 && (
                        <AcceptBuyInsurance
                            state={state}
                            setState={setState}
                            menu={menu}
                            checkUpgrade={checkUpgrade}
                            setCheckUpgrade={setCheckUpgrade}
                            getPrice={getPrice}
                            handelSetActive={setActive}
                            setNoti={setNameNoti}
                            setRes={setRes}
                            setIndex={setIndex}
                        ></AcceptBuyInsurance>
                    )}
                </>
            )}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'insurance', 'home'])),
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
        console.log('fecth current price error')
    }
}

export const getPrice = async (symbol: string, state: any, setState: any) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${symbol}`)
        if (data) {
            if (data.data[0]) {
                return setState({ ...state, p_market: data.data[0]?.p })
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export const getPriceOnly = async (symbol: string) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=${symbol}`)
        if (data) {
            if (data.data[0]) {
                return data.data[0]?.p
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export const getPriceBNBUSDT = async (setPriceBNB: any) => {
    try {
        const { data } = await axios.get(`https://test.nami.exchange/api/v3/spot/market_watch?symbol=BNBUSDT`)
        if (data) {
            if (data.data[0]) {
                return setPriceBNB(data.data[0].p)
            }
        }
    } catch (err) {
        console.log('fecth current price error')
    }
}

export default InsuranceFrom
