import { ICoin } from 'components/common/Input/input.interface'
import InputNumber from 'components/common/Input/InputNumber'
import { CheckCircle, InfoCircle } from 'components/common/Svg/SvgIcon'
import Tooltip from 'components/common/Tooltip/Tooltip'
import useWindowSize from 'hooks/useWindowSize'
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Suspense, useState } from 'react'
import { Check, ChevronDown, ChevronUp } from 'react-feather'
import colors from 'styles/colors'
import { screens } from 'utils/constants'
import HeaderContent from './HeaderContent'
import { Menu, Popover, Tab } from '@headlessui/react'

const ChartComponent = dynamic(() => import('./ChartComponent'), {
    ssr: false,
    suspense: true,
})

type IProps = {
    q_covered: number
    p_claim: number
    margin: number
    period: number
    p_market: number
    account: any
    selectCoin: ICoin
    tab: number | 0 | 1
    percentInsurance: any
    unitMoney: string
    percentMargin: any
    decimalList: {
        decimal_q_covered: number
        decimal_margin: number
        decimal_p_claim: number
    }
    listCoin: ICoin[]
    dataChart: any
    listTime: string[]
    clear: any
    selectTime: string
    listTabPeriod: number[]
    saved: number
    r_claim: any
    q_claim: any
    chosing: boolean
    userBalance: number
    updateFormQCovered: (data: number) => any
    validator: (key: string) => any
    onHandleChange: (key: string, value: any) => any
    updateFormPercentMargin: (data: number) => any
    handleUpdateToken: (coin: ICoin) => any
    setTab: (tab: number) => any
    setSelectTime: (time: string) => any
    handleChangePeriod: (value: number) => any
    setChosing: (value: boolean) => any
    handleNext: () => any
    setShowDetails: (value: boolean) => any
    setP_market: (value: number) => any
}

const InsuranceFromWeb = ({
    account,
    q_covered,
    p_claim,
    selectCoin,
    tab,
    margin,
    unitMoney,
    decimalList,
    percentInsurance,
    percentMargin,
    listCoin,
    dataChart,
    period,
    p_market,
    listTime,
    clear,
    selectTime,
    listTabPeriod,
    saved,
    r_claim,
    q_claim,
    chosing,
    userBalance,
    updateFormQCovered,
    validator,
    onHandleChange,
    updateFormPercentMargin,
    handleUpdateToken,
    setTab,
    setSelectTime,
    handleChangePeriod,
    setChosing,
    handleNext,
    setShowDetails,
    setP_market,
}: IProps) => {
    const router = useRouter()
    const { width, height } = useWindowSize()
    const isMobile = width && width <= screens.drawer
    const [showCroll, setShowCroll] = useState(false)
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const renderPopoverQCover = () => (
        <Popover className="relative outline-none bg-hover focus:ring-0 flex items-center justify-center">
            <Popover.Button
                id={'popoverInsurance'}
                className={'flex flex-row justify-end w-full items-center focus:border-0 focus:ring-0 active:border-0'}
                onClick={() => {
                    setChosing(!chosing)
                }}
            >
                <img alt={''} src={`${selectCoin && selectCoin?.icon}`} width="20" height="20" className={'mr-1 rounded-[50%]'}></img>
                <span className={'whitespace-nowrap text-red mr-2'}>{selectCoin && selectCoin?.name}</span>
                <div className="min-w-[1rem]">{!chosing ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</div>
            </Popover.Button>
            <Popover.Panel className="absolute z-50 bg-white top-12 -right-3 w-[360px] rounded-[3px] shadow-dropdown">
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
                                        }}
                                        onClick={() => {
                                            close()
                                            handleUpdateToken(coin)
                                        }}
                                        className={`${
                                            isPress ? 'bg-gray-1' : 'hover:bg-hover'
                                        } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                    >
                                        <div className="max-w-[20px] mr-[0.5rem] max-h-[20px] ">
                                            <img alt={''} src={`${coin.icon}`} width="20" height="20" className={'mr-[5px] rounded-[50%]'}></img>
                                        </div>
                                        <div className={'flex flex-row justify-between w-full text-sm'}>
                                            <span className={'hover:cursor-default'}>{coin.name}</span>
                                            {coin.id === selectCoin?.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        id={`${coin.id}`}
                                        key={key}
                                        className={`hover:bg-hover flex flex-row justify-start w-full items-center p-3 text-divider font-medium`}
                                    >
                                        <div className="max-w-[20px] mr-[0.5rem] max-h-[20px] ">
                                            <img alt={''} src={`${coin.icon}`} width="20" height="20" className={'mr-[5px] rounded-[50%]'}></img>
                                        </div>
                                        <div className={'flex flex-row justify-between w-full text-sm'}>
                                            <span>{coin.name}</span>
                                        </div>
                                    </a>
                                )
                            })}
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    )

    const renderPopoverMargin = () => (
        <Popover className="relative">
            <Popover.Button disabled={true} className={'flex items-center space-x-2 hover:cursor-pointer'}>
                <span className="text-gray">{unitMoney}</span> {/*!changeUnit2 ? <ChevronDown size={16} /> : <ChevronUp size={16} />*/}
            </Popover.Button>
            <Popover.Panel
                className="flex flex-col min-w-[18rem] absolute top-12 -right-3 bg-white z-[100] rounded-[3px] shadow-dropdown"
                style={{
                    boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)',
                }}
            >
                {({ close }) => (
                    <div className="flex flex-col justify-center h-full ">
                        {['USDT', 'BUSD', 'USDC'].map((e, key) => {
                            return (
                                <div
                                    key={key}
                                    className={`py-2 text-sm px-4 cursor-pointer hover:bg-hover font-normal`}
                                    onClick={() => {
                                        close()
                                    }}
                                >
                                    <span>{e}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Popover.Panel>
        </Popover>
    )

    return (
        <>
            {account?.address != null && (
                <div className="w-full bg-[#E5E7E8]  h-[0.25rem] sticky top-[4.1875rem] z-[50]">
                    <div className="bg-red h-[0.25rem] w-1/2"></div>
                </div>
            )}
            <div className="px-4 mb:px-10 lg:px-20">
                <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                    <HeaderContent state={tab} setState={setTab} auth={account.address} />

                    <div className="flex flex-row mb-[8rem] overflow-hidden">
                        <div className="w-8/12">
                            {
                                <div
                                    className={`shadow border border-1 border-divider h-auto rounded-xl  p-8`}
                                    onClick={() => {
                                        setChosing(false)
                                    }}
                                >
                                    <div id="tour_statistics" data-tut="tour_statistics">
                                        <div className={'pb-2 text-sm leading-5 text-txtSecondary flex items-center space-x-6'}>
                                            <div className={'w-1/2 flex flex-row items-center'}>
                                                <span className="mr-2">{t('insurance:buy:q_covered')}</span>
                                                <div data-tip={t('insurance:terminology:q_covered')} data-for={`q_covered`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'q_covered'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={'w-1/2 flex flex-row justify-end text-right'}>
                                                <span className="mr-2">{t('common:available', { value: userBalance })}</span>
                                            </div>
                                        </div>
                                        <div className={'pb-2 space-x-6 flex justify-between'}>
                                            <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                                <InputNumber
                                                    validator={validator('q_covered')}
                                                    value={q_covered}
                                                    onChange={(e: any) => onHandleChange('q_covered', e)}
                                                    customSuffix={renderPopoverQCover}
                                                    decimal={decimalList.decimal_q_covered}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row w-full space-x-6 text-xs font-semibold">
                                        <div className={`flex flex-row justify-between space-x-4 w-full `}>
                                            {[25, 50, 75, 100].map((data) => {
                                                return (
                                                    <div
                                                        key={data}
                                                        className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                        onClick={() => {
                                                            updateFormQCovered(data)
                                                        }}
                                                    >
                                                        <div
                                                            className={`${percentInsurance.current == data ? 'bg-red' : 'bg-gray-1'} h-1 w-full rounded-sm`}
                                                        ></div>
                                                        <div className={percentInsurance.current === data ? 'text-red' : 'text-gray'}>{data}%</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div data-tut="tour_chart" id="tour_chart" className="mt-6 mb-4">
                                        <div className={'flex flex-row relative'}>
                                            <Suspense fallback={`Loading...`}>
                                                <ChartComponent
                                                    height={280}
                                                    data={dataChart}
                                                    state={{
                                                        period: period,
                                                        q_covered: q_covered,
                                                        margin: margin,
                                                        p_claim: p_claim,
                                                        p_market: p_market,
                                                    }}
                                                    setP_Claim={(data: number) => {
                                                        onHandleChange('p_claim', data)
                                                    }}
                                                    resolution={selectTime!}
                                                />
                                                <svg
                                                    className={`absolute right-0 z-2`}
                                                    width="3"
                                                    height={280}
                                                    viewBox="0 0 2 500"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <line
                                                        x1="1"
                                                        y1="3.5011e-08"
                                                        x2="0.999987"
                                                        y2="500"
                                                        stroke="#B2B7BC"
                                                        strokeWidth="150"
                                                        strokeDasharray="0.74 3.72"
                                                    ></line>
                                                </svg>
                                            </Suspense>
                                        </div>

                                        <div className={'flex flex-row justify-between items-center w-full mt-5'}>
                                            {listTime.map((time, key) => {
                                                return (
                                                    <div
                                                        key={key}
                                                        className={`${
                                                            selectTime == time ? 'text-red' : 'text-txtSecondary'
                                                        } hover:cursor-pointer font-medium  text-sm`}
                                                        onClick={() => {
                                                            setSelectTime(time)
                                                        }}
                                                    >
                                                        {time}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className={'my-6'}>
                                            <span className={'flex flex-row items-center text-txtSecondary text-sm'}>
                                                <span className={'mr-2'}>P-Claim</span>
                                                <div data-tip={t('insurance:terminology:p_claim')} data-for={`p_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'p_claim'} placement="right" />
                                                </div>
                                            </span>

                                            <InputNumber
                                                className="mt-2"
                                                validator={validator('p_claim')}
                                                value={p_claim}
                                                onChange={(e: any) => onHandleChange('p_claim', e)}
                                                customSuffix={() => unitMoney}
                                                suffixClassName="text-txtSecondary"
                                                placeholder={`${t('insurance:buy:example')}`}
                                                decimal={decimalList.decimal_p_claim}
                                            />
                                        </div>
                                    </div>

                                    <div className={'mt-5 text-sm '} data-tut="tour_period" id="tour_period">
                                        <span className="flex flex-row items-center text-txtSecondary">
                                            <span className={'mr-[0.5rem]'}>Period ({t('insurance:buy:day')})</span>
                                            <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                                <InfoCircle size={14} color={colors.txtSecondary} />
                                                <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                            </div>
                                        </span>
                                        <Tab.Group>
                                            <Tab.List
                                                className={`flex flex-row mt-4 justify-between ${
                                                    showCroll ? 'overflow-scroll' : ' overflow-hidden'
                                                } hide-scroll`}
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
                                                            className={`${period == item && 'bg-pink text-red font-semibold'} bg-hover rounded-[300px] ${
                                                                key != 0 ? 'ml-[0.75rem]' : ''
                                                            } px-4 py-1 flex justify-center items-center hover:cursor-pointer ${
                                                                isMobile && !(item == 15) && 'mr-[12px]'
                                                            }`}
                                                            onClick={() => {
                                                                handleChangePeriod(item)
                                                            }}
                                                        >
                                                            {item}
                                                        </div>
                                                    )
                                                })}
                                            </Tab.List>
                                        </Tab.Group>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="w-4/12 flex flex-col justify-between shadow border border-1 border-divider rounded-xl p-8 ml-[1.5rem]">
                            <div>
                                {saved > 0 && (
                                    <div
                                        className={'flex flex-col justify-center items-center mb-[2.5rem] max-w-7xl 4xl:max-w-screen-3xl m-auto'}
                                        onClick={() => {
                                            setChosing(false)
                                        }}
                                    >
                                        <CheckCircle size={68}></CheckCircle>
                                        <span className={'font-medium text-base text-txtPrimary mt-[1rem]'}>
                                            {`${t('insurance:buy:saved')} `}
                                            <span className={'text-red'}>
                                                ${saved.toFixed(4)} {unitMoney}
                                            </span>{' '}
                                            {t('insurance:buy:sub_saved')}
                                        </span>
                                    </div>
                                )}
                                {
                                    <div
                                        className={'flex flex-col w-full justify-center items-center hover:cursor-default z-50'}
                                        onClick={() => {
                                            setChosing(false)
                                        }}
                                    >
                                        <div
                                            className={`flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                        >
                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                <span className={'mr-[0.5rem]'}>R-Claim</span>
                                                <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={''}>
                                                <span>{r_claim.current > 0 ? Number(r_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}%</span>
                                            </div>
                                        </div>
                                        <div
                                            className={` flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4 my-[1rem]`}
                                        >
                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                <span className={'mr-[0.5rem]'}>Q-Claim</span>
                                                <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={'flex flex-row justify-center items-center hover:cursor-pointer relative max-h-[24px]'}>
                                                {q_claim.current > 0 ? Number(q_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}
                                                <span className={'pl-2 mr-1'}>{unitMoney}</span>
                                                <div className="relative"></div>
                                            </div>
                                        </div>
                                        <div
                                            className={`${
                                                tab == 1 ? 'hidden' : ''
                                            } flex flex-row justify-between items-center w-full rounded-[12px] border border-divider border-0.5 px-5 py-4`}
                                        >
                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                <span className={'mr-[0.5rem]'}>Margin</span>
                                                <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={'flex flex-row items-center justify-center hover:cursor-pointer relative max-h-[24px]'}>
                                                {margin > 0 ? Number(margin.toFixed(decimalList.decimal_margin)) : 0}
                                                <span className={'pl-2 mr-1'}>{unitMoney}</span>
                                                <div className="relative"></div>
                                            </div>
                                        </div>

                                        {tab === 1 && (
                                            <>
                                                {' '}
                                                <div className={`w-full flex flex-row items-center text-sm text-txtSecondary mb-[0.5rem]`}>
                                                    <span className={'mr-2'}>Margin</span>
                                                    <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                                        <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                    </div>
                                                </div>
                                                <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                                    <InputNumber
                                                        validator={validator('margin')}
                                                        value={margin}
                                                        onChange={(e: any) => onHandleChange('margin', e)}
                                                        customSuffix={renderPopoverMargin}
                                                        decimal={decimalList.decimal_margin}
                                                    />
                                                </div>
                                                <div className={`flex flex-row justify-between space-x-4 !w-full mt-[0.5rem]`}>
                                                    {[2, 5, 7, 10].map((item, key) => {
                                                        return (
                                                            <div
                                                                key={key}
                                                                className={'flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer'}
                                                                onClick={() => {
                                                                    updateFormPercentMargin(item)
                                                                }}
                                                            >
                                                                <div
                                                                    className={`${
                                                                        percentMargin.current == item ? 'bg-red' : 'bg-gray-1'
                                                                    } h-1 w-full rounded-sm`}
                                                                ></div>
                                                                <span className={percentMargin.current == item ? 'text-red' : 'text-gray'}>{item}%</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                }
                            </div>

                            {
                                <div
                                    className={`flex flex-col justify-center items-center mb-[2rem] `}
                                    onClick={() => {
                                        setChosing(false)
                                    }}
                                >
                                    <button
                                        className={`${
                                            clear.current == true ? 'bg-red text-white border border-red' : 'text-white bg-divider border border-divider'
                                        }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] w-full`}
                                        onClick={() => {
                                            handleNext()
                                        }}
                                        disabled={!clear.current}
                                    >
                                        {t('insurance:buy:continue')}
                                    </button>
                                    <Menu>
                                        <Menu.Button className={'my-[1rem] text-blue underline hover:cursor-pointer'}>{t('insurance:buy:help')}</Menu.Button>
                                        <Menu.Items
                                            className={'flex flex-col text-txtPrimary text-sm'}
                                            style={{ boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                                        >
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        href="https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/"
                                                        className={`${active && 'bg-blue-500'}  py-[0.5rem] pl-[1rem] w-[300px] hover:bg-hover`}
                                                        onClick={() => {
                                                            router.push('https://nami.today/bao-hiem-trong-crypto-manh-dat-mau-mo-can-duoc-khai-pha/')
                                                        }}
                                                    >
                                                        <span>{t('insurance:buy:help1')}</span>
                                                    </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <a
                                                        className={`${
                                                            active && 'bg-blue-500'
                                                        }  py-[0.5rem] pl-[1rem] w-[300px] hover:bg-hover hover:cursor-pointer`}
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
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InsuranceFromWeb
