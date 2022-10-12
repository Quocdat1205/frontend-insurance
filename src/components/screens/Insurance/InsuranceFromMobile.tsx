import Button from 'components/common/Button/Button'
import { BxCaledarCheck, BxDollarCircle, BxLineChartDown, CheckCircle, InfoCircle, XMark } from 'components/common/Svg/SvgIcon'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Config from 'config/config'
import { Suspense, useEffect, useRef, useState } from 'react'
import Modal from 'components/common/Modal/Modal'
import useWindowSize from 'hooks/useWindowSize'
import { ICoin } from 'components/common/Input/input.interface'
import Tooltip from 'components/common/Tooltip/Tooltip'
import InputNumber from 'components/common/Input/InputNumber'
import colors from 'styles/colors'
import { ArrowLeft, Check } from 'react-feather'
import { GuidelineModal } from './Insurance_funtion'
import { Switch } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { screens } from 'utils/constants'

type IProps = {
    account: any
    q_covered: any
    selectCoin: ICoin
    p_claim: any
    tab: number | 0 | 1
    margin: any
    period: any
    p_market: any
    percentInsurance: any
    unitMoney: string
    percentMargin: any
    decimalList: {
        decimal_q_covered: number
        decimal_margin: number
        decimal_p_claim: number
    }
    listCoin: ICoin[]
    isCanSave: boolean
    dataChart: any
    listTime: string[]
    clear: any
    loadings: boolean
    selectTime: string
    listTabPeriod: number[]
    saved: number
    r_claim: any
    q_claim: any
    updateFormQCovered: (data: number) => any
    validator: (key: string) => any
    onHandleChange: (key: string, value: any) => any
    updateFormPercentMargin: (data: number) => any
    handleUpdateToken: (coin: ICoin) => any
    setShowGuide: (boolean: boolean) => any
    setTab: (tab: number) => any
    setSelectTime: (time: string) => any
    handleChangePeriod: (value: number) => any
    setChosing: (value: boolean) => any
    handleNext: () => any
    setShowDetails: (value: boolean) => any
}

const InsuranceFromMobile = ({
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
    isCanSave,
    listCoin,
    dataChart,
    period,
    p_market,
    listTime,
    clear,
    loadings,
    selectTime,
    listTabPeriod,
    saved,
    r_claim,
    q_claim,
    updateFormQCovered,
    validator,
    onHandleChange,
    updateFormPercentMargin,
    handleUpdateToken,
    setShowGuide,
    setTab,
    setSelectTime,
    handleChangePeriod,
    setChosing,
    handleNext,
    setShowDetails,
}: IProps) => {
    const router = useRouter()
    const { width, height } = useWindowSize()
    const isMobile = width && width <= screens.drawer
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const [openChangeToken, setOpenChangeToken] = useState(false)
    const [showGuideModal, setShowGuideModal] = useState<boolean>(false)
    const tmp_q_covered = useRef(0)
    const tmp_margin = useRef(0)
    const [showChangeUnit, setShowChangeUnit] = useState({
        isShow: false,
        name: '',
    })
    const table = useRef<any>(null)
    const container = useRef<any>(null)

    const ChartComponent = dynamic(() => import('components/screens/Insurance/ChartComponent'), {
        ssr: false,
        suspense: true,
    })

    const [showInput, setShowInput] = useState<{ isShow: boolean; name: string }>({ isShow: false, name: '' })
    useEffect(() => {
        if (loadings && isMobile) {
            const timeout_guiled = setTimeout(() => {
                setShowGuide(true)

                return () => {
                    clearTimeout(timeout_guiled)
                }
            }, 500)
        }
    }, [loadings])

    const componentsInputMobile = () => {
        return (
            <div className="mx-[1rem] relative">
                <div>
                    {t('insurance:buy_mobile:q_covered')}
                    <label>
                        <span
                            id="label_q_coverd"
                            className="z-1 !w-max text-redPrimary"
                            onClick={() => {
                                setOpenChangeToken(true)
                                tmp_q_covered.current = q_covered.current
                            }}
                        >
                            {' '}
                            {width && width < 513 && width >= 437 && <br />}
                            {q_covered.current}{' '}
                        </span>
                    </label>
                    <span
                        className="text-redPrimary z-1"
                        onClick={() => {
                            setOpenChangeToken(true)
                            tmp_q_covered.current = q_covered.current
                        }}
                    >
                        {selectCoin?.type}{' '}
                    </span>
                    {p_claim.current > 0 && (
                        <>
                            {t('insurance:buy_mobile:at')} <span className="text-redPrimary">${p_claim.current} </span>
                            {tab != 1 && '?'}
                        </>
                    )}
                    {tab == 1 && (
                        <>
                            {t('insurance:buy_mobile:and')} {t('insurance:buy_mobile:margin')}{' '}
                            <label>
                                <span className="text-redPrimary">
                                    <span
                                        onClick={() => {
                                            setShowInput({ isShow: true, name: 'margin' })
                                            tmp_margin.current = margin.current
                                        }}
                                    >
                                        {margin.current && margin.current}{' '}
                                    </span>
                                    <span
                                        onClick={() => {
                                            setShowInput({ isShow: true, name: 'margin' })
                                            tmp_margin.current = margin.current
                                        }}
                                    >
                                        {unitMoney}
                                    </span>
                                </span>
                            </label>
                            ?
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            {account.address == null ? (
                <>
                    <div style={{ background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.15) 0%, rgba(254, 205, 211, 0) 100%)' }}>
                        <div className="px-[1rem] pt-[0.5rem]" onClick={() => router.push('/home')}>
                            <XMark />
                        </div>
                        <div className="flex flex-col items-center px-[3.75rem] pt-[0.5rem]">
                            <img src={'/images/icons/ic_pig.png'} width="269" height="212" className="w-[17rem] h-auto" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center pt-[1rem] text-txtPrimary">
                        <span className="text-xl font-semibold ">Nami Insurance</span>
                        <span className="text-center text-sm pt-[0.75rem] w-[342px] h-[40px]">
                            {t('insurance:mobile_login:sub_title1')} - {t('insurance:mobile_login:sub_title2')}
                        </span>
                    </div>
                    <div className="px-[1.5rem] flex flex-col justify-center mt-[1.75rem] mb-[3rem]">
                        <div className="flex flex-row">
                            <div className="pr-[1rem]">
                                <BxDollarCircle />
                            </div>
                            <div className="flex flex-col pr-[7px]">
                                <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:token')}</span>
                                <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:token_detail')}</span>
                            </div>
                        </div>
                        <div className="flex flex-row my-[24px]">
                            <div className="pr-[1rem]">
                                <BxLineChartDown />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:p_claim')}</span>
                                <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:p_claim_detail')}</span>
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="pr-[1rem]">
                                <BxCaledarCheck />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-txtPrimary text-sm font-semibold">{t('insurance:mobile_login:period')}</span>
                                <span className="text-sm text-txtSecondary">{t('insurance:mobile_login:period_detial')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mb-[1rem]">
                        <Button
                            variants={'primary'}
                            className={`bg-red text-sm font-semibold h-[40.5rem] w-[95%] tiny:w-[374px] flex justify-center items-center text-white rounded-[0.5rem] py-[12px]`}
                            onClick={() => {
                                Config.connectWallet()
                            }}
                        >
                            {t('insurance:mobile_login:connect_wallet')}
                        </Button>
                    </div>
                    <div
                        className={` hover:cursor-pointer flex justify-center text-red text-sm line-height-[19px] underline`}
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
                        <Modal
                            portalId="modal"
                            isVisible={true}
                            className={`!sticky !bottom-0 !left-0 !rounded-none !h-[${height && height}px]`}
                            onBackdropCb={() => setShowChangeUnit({ ...showChangeUnit, isShow: false, name: '' })}
                        >
                            <div className={`h-max bg-white text-sm  mx-auto `}>
                                <div className="flex flex-col justify-center my-[24px]">
                                    <div className="font-medium text-xl">{showChangeUnit.name}</div>
                                    <div className="mt-[32px] divide-y divide-divider text-txtPrimary w-full">
                                        {['USDT', 'USDC', 'BUSD'].map((item, key) => {
                                            return (
                                                <div
                                                    key={key}
                                                    className="w-full flex flex-row justify-between items-center hover:bg-gray-1 hover:pl-[0.5rem] font-normal"
                                                    onClick={() => {
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
                    {showInput.isShow && (
                        <Modal
                            portalId="modal"
                            isVisible={true}
                            className={`!sticky !bottom-0 !left-0 !rounded-none !translate-x-0 !translate-y-0 h-1/2 !max-w-full`}
                            onBackdropCb={() => {
                                setShowInput({ ...showInput, isShow: false, name: '' })
                                if (showInput.name == 'q_covered') {
                                    q_covered.current = tmp_q_covered.current
                                    percentInsurance.current = 0
                                }
                                if (showInput.name == 'margin') {
                                    margin.current = tmp_margin.current
                                    percentMargin.current = 0
                                }
                            }}
                        >
                            <div className="bg-white  !sticky !bottom-0 !left-0">
                                <div className="text-txtPrimary text-xl font-semibold mb-[1.5rem]">{t(`insurance:buy:${showInput.name}`)}</div>
                                <div className={'text-txtSecondary text-base mb-[0.5rem] flex flex-row items-center'}>
                                    <span className={'mr-2'}>{t(`insurance:buy:${showInput.name}`)}</span>
                                    <div data-tip={t(`insurance:terminology:${showInput.name}`)} data-for={`${showInput.name}`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={`${showInput.name}`} placement="right" />
                                    </div>
                                </div>

                                {showInput.name === 'q_covered' ? (
                                    <>
                                        <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full mb-[0.5rem]`}>
                                            <InputNumber
                                                validator={validator(`q_covered`)}
                                                value={q_covered.current}
                                                onChange={(e: any) => onHandleChange('q_covered', e)}
                                                decimal={decimalList.decimal_q_covered}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={`flex justify-between border-collapse rounded-[3px] shadow-none w-full mb-[0.5rem]`}>
                                            <InputNumber
                                                validator={validator(`margin`)}
                                                value={margin.current}
                                                onChange={(e: any) => onHandleChange('margin', e)}
                                                decimal={decimalList.decimal_margin}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className={`flex flex-row justify-between space-x-4 w-full text-xs mb-[1.5rem]`}>
                                    {showInput.name === 'q_covered' &&
                                        [25, 50, 75, 100].map((data) => {
                                            return (
                                                <div
                                                    key={data}
                                                    className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                    onClick={() => {
                                                        updateFormQCovered(data)
                                                    }}
                                                    onTouchStart={() => {
                                                        updateFormQCovered(data)
                                                    }}
                                                >
                                                    <div className={`${percentInsurance.current == data ? 'bg-red' : 'bg-gray-1'} h-1 w-full rounded-sm`}></div>
                                                    <div className={percentInsurance.current == data ? 'text-red' : 'text-gray'}>{data}%</div>
                                                </div>
                                            )
                                        })}
                                    {showInput.name === 'margin' &&
                                        [2, 5, 7, 10].map((data) => {
                                            return (
                                                <div
                                                    key={data}
                                                    className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}
                                                    onClick={() => {
                                                        updateFormPercentMargin(data)
                                                    }}
                                                    onTouchStart={() => {
                                                        updateFormPercentMargin(data)
                                                    }}
                                                >
                                                    <div className={`${percentMargin.current == data ? 'bg-red' : 'bg-gray-1'} h-1 w-full rounded-sm`}></div>
                                                    <div className={percentMargin.current === data ? 'text-red' : 'text-gray'}>{data}%</div>
                                                </div>
                                            )
                                        })}
                                </div>
                                <Button
                                    disabled={!isCanSave}
                                    variants={'primary'}
                                    className={`${
                                        !isCanSave ? 'bg-hover' : 'bg-red'
                                    } h-[40.5rem] w-full flex justify-center items-center text-white rounded-[0.5rem] py-[12px]`}
                                    onClick={() => {
                                        setShowInput({ ...showInput, isShow: false, name: '' })
                                    }}
                                >
                                    {t('insurance:buy:save')}
                                </Button>
                            </div>
                        </Modal>
                    )}
                    {openChangeToken && (
                        <Modal
                            wrapClassName="!w-full"
                            containerClassName="!w-full"
                            portalId="modal"
                            isVisible={true}
                            className=" bg-white !max-w-full !w-full !sticky !bottom-0 !left-0 !rounded-none !translate-x-0 !translate-y-0 h-1/2"
                            onBackdropCb={() => {
                                setShowInput({ isShow: true, name: 'q_covered' })
                                setOpenChangeToken(false)
                            }}
                        >
                            <div className="bg-white text-sm  mx-auto">
                                <div className="font-semibold text-xl mb-[24px]">{t('insurance:buy:asset')}</div>
                                <div>
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
                                                        handleUpdateToken(coin)
                                                        setOpenChangeToken(false)
                                                        setShowInput({ isShow: true, name: 'q_covered' })
                                                    }}
                                                    className={`${
                                                        isPress ? 'bg-gray-1' : 'hover:bg-hover'
                                                    } flex flex-row justify-start w-full items-center p-3 font-medium`}
                                                >
                                                    <img alt={''} src={`${coin.icon}`} width="24" height="24" className={'mr-[12px] rounded-[50%]'}></img>
                                                    <div className={'flex flex-row justify-between w-full'}>
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
                                                    <img
                                                        alt={''}
                                                        src={`${coin.icon}`}
                                                        width="24"
                                                        height="24"
                                                        className={'mr-[12px] rounded-[50%] grayscale hover:cursor-default'}
                                                    ></img>
                                                    <div className={'flex flex-row justify-between w-full'}>
                                                        <span>{coin.name}</span>
                                                        {coin.id === selectCoin?.id ? <Check size={16} className={'text-red'}></Check> : ''}
                                                    </div>
                                                </a>
                                            )
                                        })}
                                </div>
                            </div>
                        </Modal>
                    )}
                    {
                        <div className={`h-[32px] flex flex-row justify-between items-center mx-[1rem] mt-[24px] mb-[1rem]  top-0 bg-white z-50`}>
                            <div
                                onClick={() => {
                                    router.push('/home')
                                }}
                            >
                                <ArrowLeft />
                            </div>
                            <div data-tut="tour_custom" id="tour_custom" className={`h-[32px] flex flex-row mx-[1rem]`}>
                                <span
                                    className={'text-blue underline hover:cursor-pointer pr-[1rem] flex items-center'}
                                    onClick={() => {
                                        setShowGuideModal(true)
                                    }}
                                >
                                    {t('insurance:guild:title')}
                                </span>

                                <GuidelineModal
                                    visible={showGuideModal}
                                    onClose={() => setShowGuideModal(false)}
                                    t={t}
                                    onShowTerminologyModal={() => setShowDetails(true)}
                                    onShowGuildline={() => setShowGuide(true)}
                                />
                                <div className="flex items-center">
                                    <Switch
                                        checked={tab == 1 ? true : false}
                                        onChange={() => {
                                            if (tab == 1) {
                                                return setTab(0)
                                            } else {
                                                setShowInput({ isShow: true, name: 'margin' })
                                                return setTab(1)
                                            }
                                        }}
                                        className={`${
                                            tab == 1 ? 'bg-red' : 'bg-[#F2F3F4]'
                                        } relative inline-flex items-center h-[1rem] rounded-full w-[32px] transition-colors shadow-sm`}
                                    >
                                        <span
                                            className={`${
                                                tab == 1 ? 'translate-x-[1.25rem] bg-[white]' : 'translate-x-1 bg-[#B2B7BC]'
                                            } inline-block w-[6px] h-[6px] transform bg-white rounded-full transition-transform text-white/[0]`}
                                        >
                                            {tab == 1 ? 'Enable' : 'Disable'}
                                        </span>
                                    </Switch>
                                    <span className="pl-[0.5rem]">{t('insurance:buy:change')}</span>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        <div
                            data-tut="tour_statistics"
                            id="tour_statistics"
                            className=" my-[24px] w-full mx-auto flex flex-wrap flex-col justify-center content-center font-bold text-2xl relative "
                        >
                            {componentsInputMobile()}
                        </div>
                    }
                    {
                        <div data-tut="tour_chart" id="tour_chart" className="">
                            <div className={'flex flex-row relative'}>
                                <Suspense fallback={`Loading...`}>
                                    <ChartComponent
                                        width={358}
                                        height={252}
                                        data={dataChart}
                                        state={{
                                            period: period.current,
                                            q_covered: q_covered.current,
                                            margin: margin.current,
                                            p_claim: p_claim.current,
                                            p_market: p_market.current,
                                        }}
                                        setP_Claim={(data: number) => (p_claim.current = data)}
                                        setP_Market={(data: number) => (p_market.current = data)}
                                        isMobile={isMobile as boolean}
                                        resolution={selectTime!}
                                    ></ChartComponent>
                                </Suspense>
                                <svg
                                    className={`absolute right-1 z-2`}
                                    width="3"
                                    height={252}
                                    viewBox="0 0 2 500"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="1" y1="3.5011e-08" x2="0.999987" y2="500" stroke="#B2B7BC" strokeWidth="150" strokeDasharray="0.74 3.72"></line>
                                </svg>
                            </div>

                            <div className={'flex flex-row justify-between items-center w-full mt-5 pl-[32px] pr-[32px]'}>
                                {listTime.map((time, key) => {
                                    return (
                                        <div
                                            key={key}
                                            className={`${selectTime == time ? 'text-red' : 'text-txtSecondary'} hover:cursor-pointer font-medium  text-sm`}
                                            onClick={() => {
                                                setSelectTime(time)
                                            }}
                                        >
                                            {time}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={'my-[24px] px-[32px]'}>
                                <span className={'flex flex-row items-center '}>
                                    <span className={'mr-[6px] text-txtSecondary text-sm'}>P-Claim</span>
                                    <div data-tip={t('insurance:terminology:p_claim')} data-for={`p_claim`}>
                                        <InfoCircle size={14} color={colors.txtSecondary} />
                                        <Tooltip className="max-w-[200px]" id={'p_claim'} placement="right" />
                                    </div>
                                </span>
                                <InputNumber
                                    className="mt-2"
                                    validator={validator('p_claim')}
                                    value={p_claim.current}
                                    onChange={(e: any) => onHandleChange('p_claim', e)}
                                    customSuffix={() => unitMoney}
                                    suffixClassName="text-txtSecondary"
                                    placeholder={`${t('insurance:buy:example')}`}
                                    decimal={decimalList?.decimal_p_claim}
                                />
                            </div>
                        </div>
                    }
                    {/* Period */}
                    {
                        <div data-tut="tour_period" id="tour_period" className={'mt-5 pl-[32px] pr-[32px] pb-[32px] text-sm text-txtSecondary'}>
                            <span className="flex flex-row items-center">
                                <span className={'mr-[0.5rem]'}>Period ({t('insurance:buy:day')})</span>
                                <div data-tip={t('insurance:terminology:period')} data-for={`period`}>
                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                    <Tooltip className="max-w-[200px]" id={'period'} placement="right" />
                                </div>
                            </span>
                            <div ref={table} className="overflow-auto hide-scroll scroll-table">
                                <div ref={container} className={`hide-scroll flex flex-row justify-between mt-[1rem]  ${isMobile ? 'w-full' : 'w-[85%]'} `}>
                                    {listTabPeriod.map((item, key) => {
                                        if (item == period.current || item <= item + 6)
                                            return (
                                                <div
                                                    key={key}
                                                    className={`${
                                                        period == item && 'bg-[#FFF1F2] text-red'
                                                    } bg-hover rounded-[300px] p-3 h-[32px] w-[49px] flex justify-center items-center hover:cursor-pointer ${
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
                                </div>
                            </div>
                        </div>
                    }

                    {clear.current && (
                        <>
                            {
                                <div
                                    onClick={() => {
                                        setChosing(false)
                                    }}
                                    className={`${clear ? 'visible' : 'invisible'} items-center w-[300px] xs:w-full`}
                                >
                                    {saved > 0 && (
                                        <div className={'flex justify-center items-center mt-[24px] mx-[1rem]'}>
                                            <CheckCircle></CheckCircle>
                                            <span className={'text-sm text-txtPrimary w-[230px] xs:w-full px-[4px] font-semibold'}>
                                                {t('insurance:buy:saved')}{' '}
                                                <span className={'text-red'}>
                                                    {saved.toFixed(4)} {unitMoney}
                                                </span>{' '}
                                                {t('insurance:buy:sub_saved')}
                                            </span>
                                        </div>
                                    )}
                                    <div className={'flex flex-col mt-[24px] hover:cursor-default'}>
                                        <div className={` flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[1rem] mx-[12px]`}>
                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                <span className={'mr-[0.5rem]'}>R-Claim</span>
                                                <div data-tip={t('insurance:terminology:r_claim')} data-for={`r_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'r_claim'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={'font-semibold'}>
                                                <span>{r_claim.current > 0 ? Number(r_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}%</span>
                                            </div>
                                        </div>
                                        <div className={` flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[1rem] mx-[12px]`}>
                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                <span className={'mr-[0.5rem]'}>Q-Claim</span>
                                                <div data-tip={t('insurance:terminology:q_claim')} data-for={`q_claim`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'q_claim'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={'font-semibold flex flex-row hover:cursor-pointer relative'}>
                                                {q_claim.current > 0 ? Number(q_claim.current.toFixed(decimalList.decimal_q_covered)) : 0}
                                                <span
                                                    className={'text-red pl-[0.5rem]'}
                                                    onClick={() => {
                                                        setShowChangeUnit({
                                                            ...showChangeUnit,
                                                            isShow: true,
                                                            name: `${t('insurance:unit:q_claim')}`,
                                                        })
                                                    }}
                                                >
                                                    {unitMoney}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`${
                                                tab === 1 ? 'hidden' : ''
                                            } flex flex-row justify-between items-center rounded-[12px] px-[24px] py-[1rem] mx-[12px]`}
                                        >
                                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                                <span className={'mr-[0.5rem]'}>Margin</span>
                                                <div data-tip={t('insurance:terminology:margin')} data-for={`margin`}>
                                                    <InfoCircle size={14} color={colors.txtSecondary} />
                                                    <Tooltip className="max-w-[200px]" id={'margin'} placement="right" />
                                                </div>
                                            </div>
                                            <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                                {margin.current > 0 ? Number(margin.current.toFixed(decimalList.decimal_margin)) : 0}

                                                <span
                                                    className={'text-red pl-[0.5rem]'}
                                                    onClick={() => {
                                                        // khi nào hỗ trợ đỏi đơn vị tiền thi bỏ command
                                                        // setShowChangeUnit({ ...showChangeUnit, isShow: true, name: `${t('insurance:unit:margin')}` })
                                                    }}
                                                >
                                                    {unitMoney}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col justify-center items-center mb-[32px] mx-[1rem]`}>
                                        <button
                                            className={`${
                                                clear.current == true ? 'bg-red text-white border border-red' : 'text-white bg-divider border border-divider'
                                            }flex items-center justify-center rounded-lg px-auto py-auto font-semibold py-[12px] !px-[100px] xs:px-[140.5rem]`}
                                            onClick={() => {
                                                handleNext()
                                            }}
                                            disabled={!clear.current}
                                        >
                                            {t('insurance:buy:continue')}
                                        </button>
                                    </div>
                                </div>
                            }
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default InsuranceFromMobile
