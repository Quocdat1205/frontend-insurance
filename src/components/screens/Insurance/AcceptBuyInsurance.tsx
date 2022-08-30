import Button from 'components/common/Button/Button'
import { CheckBoxIcon, CheckCircle, ErrorCircleIcon, StartIcon } from 'components/common/Svg/SvgIcon'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type IProps = {
    state: any
    menu: any
    checkUpgrade: boolean
    setCheckUpgrade: any
    handleCheckValidate: any
}

export const AcceptBuyInsurance = ({ state, menu, checkUpgrade, setCheckUpgrade, handleCheckValidate }: Partial<IProps>) => {
    const { t } = useTranslation()
    return (
        <>
            <div
                className="max-w-screen-md mx-auto relative flex flex-col"
                style={{ filter: 'drop-shadow(0px 6px 18px rgba(9, 30, 66, 0.15)) drop-shadow(0px 0px 1px rgba(9, 30, 66, 0.31))' }}
            >
                <div className="relative bg-white" style={{ borderRadius: '5px 5px 0 0' }}>
                    <div className={'flex justify-center items-center my-[32px]'}>
                        <CheckCircle />
                        <span className={'font-semibold text-[#22313F]'}>
                            {t('insurance:buy:saved')}
                            <span className={'text-[#EB2B3E]'}>1,000 USDT</span> {t('insurance:buy:sub_saved')}
                        </span>
                    </div>
                </div>
                <div
                    className=" relative h-[40px] z-2 mx-[20px] px-[10px] bg-[white]
                            before:left-[0px] before:bg-transparent before:top-[20px] before:absolute before:content-[' '] before:w-[40px] before:h-[40px] before:border-transparent before:border-[1.5px] before:border-t-[red] before:border-r-[red] before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:rounded-[50%]
                            after:right-[-40px] after:top-[20px] after:absolute after:content-[' '] after:w-[40px] after:h-[40px] after:border-transparent after:border-[1.5px] after:border-t-[red] after:border-r-[red] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-[225deg] after:rounded-[50%] 
                            "
                ></div>

                <div className="bg-[white] p-[1px] py-[32px]" style={{ borderRadius: '0 0 5px 5px' }}>
                    <div className={''}>
                        <div className="p-[32px]">
                            <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                                <div className={'text-[#808890]'}>R-Claim</div>
                                <div className={'font-semibold'}>
                                    <span>{state.r_claim}%</span>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                <div className={'text-[#808890]'}>Q-Claim</div>
                                <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                    {state.q_claim}
                                    <span className={'text-[#EB2B3E]'}>USDT</span>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between py-[8px] px-[8px] bg-[#F7F8FA]">
                                <div className={'text-[#808890]'}>Margin</div>
                                <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                    {state.margin}
                                    <span className={'text-[#EB2B3E]'}>USDT</span>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between py-[8px] px-[8px]">
                                <div className={'text-[#808890]'}>Period</div>
                                <div className={'font-semibold'}>
                                    <span>
                                        {state.r_claim} {menu[8].name}
                                    </span>
                                </div>
                            </div>
                            <div className="text-[#B2B7BC] text-xs py-[16px]">
                                *{t('insurance:buy:notified')} 10,000$ - 12,000$ {t('insurance:buy:notified_sub')}
                            </div>
                            <div className="text-[#EB2B3E] bg-[#F7F8FA] rounded-[12px] mb-[24px] w-full flex flex-row justify-between items-center px-[18px]">
                                <div className={'flex flex-row py-[14px]'}>
                                    <span className="">
                                        <ErrorCircleIcon />
                                    </span>
                                    <span className=""> {t('insurance:buy:price_had_update')}</span>
                                </div>
                                <div>
                                    <Button variants="outlined" className="py-[8px] px-[24px] rounded-[8px]">
                                        {t('insurance:buy:accept')}
                                    </Button>
                                </div>
                            </div>
                            <div
                                className="rounded-[12px] p-[24px] flex flex-row items-center border-[#F7F8FA] border-1 relative"
                                style={{ boxShadow: '0px 6px 18px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)' }}
                            >
                                <div className={'rounded-[99999px] mr-[24px]'} style={{ background: 'linear-gradient(180deg, #FFFFFF -56.68%, #E6E6E6 100%)' }}>
                                    <img src={'/images/logo.png'} className="py-[12px] px-[17px]" />
                                </div>
                                <div className="flex flex-col select-none">
                                    <div>
                                        <div className="flex items-center mr-4 py-[8px] ">
                                            <input
                                                className={'hover:cursor-pointer hidden'}
                                                type="radio"
                                                id="test1"
                                                checked={checkUpgrade}
                                                onClick={() => setCheckUpgrade(!checkUpgrade)}
                                            />
                                            <CheckBoxIcon
                                                bgColor="#F7F8FA"
                                                dotColor="#F7F8FA"
                                                size={24}
                                                borderColor="#E5E7E8"
                                                checked={checkUpgrade}
                                                checkBgColor="#F7F8FA"
                                                checkDotColor="#EB2B3E"
                                                checkBorderColor="#EB2B3E"
                                                className="hover:cursor-pointer mr-[8px]"
                                                onClick={() => setCheckUpgrade(!checkUpgrade)}
                                            />
                                            <label htmlFor="test1" className="select-none text-[#22313F] font-medium">
                                                {t('insurance:buy:upgrade')}
                                            </label>
                                        </div>
                                    </div>
                                    <span className="select-none text-[#22313F] font-medium">{t('insurance:buy:upgrade_info')}</span>
                                    <div
                                        style={{
                                            background: 'linear-gradient(88.09deg, #CE0014 0.48%, #E92828 52.94%, #FF5F6D 114.93%)',
                                            borderRadius: '0px 0px 600px 600px',
                                        }}
                                        className={'absolute top-0 right-[24px] w-[48px] h-[48px] flex justify-center items-center'}
                                    >
                                        <StartIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'flex flex-col justify-center items-center mt-[146px]'}>
                <Button
                    variants={'primary'}
                    className={`${
                        handleCheckValidate() ? 'bg-[#E5E7E8]' : 'bg-[#EB2B3E]'
                    }  h-[48px] w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                >
                    {t('insurance:buy:accept')}
                </Button>
                <span>
                    {t('insurance:buy:Term_of_Service')}{' '}
                    <span className={'my-[16px] text-[#00ABF9] underline hover:cursor-pointer'}>{t('insurance:buy:Term_of_Service_sub')}</span>
                </span>
            </div>
        </>
    )
}
