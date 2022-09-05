import Button from 'components/common/Button/Button'
import { Input } from 'components/common/Input/input'
import { SuccessIcon } from 'components/common/Svg/SvgIcon'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export type iProps = {
    id: string
    name: 'success' | 'expired' | 'expired1' | 'email'
}

const NotificationInsurance = ({ id, name }: iProps) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState()
    const noti = [
        {
            name: 'success',
            icon: <SuccessIcon />,
            description: `${t('insurance:final:succes')}`,
        },
        {
            name: 'expired',
            icon: <img src="/images/expired.png" className="w-[100px] h-[100px]" />,
            description: `${t('insurance:final:contract')}`,
            sub_Description: `${t('insurance:final:contract_sub')}`,
            reason: `${t('insurance:final:reasons')}`,
        },
        {
            name: 'expired1',
            icon: <img src="/images/calendar.png" className="w-[100px] h-[100px]" />,
            description: `${t('insurance:final:contract')}`,
            sub_Description: `${t('insurance:final:contract_sub')}`,
            reason: `${t('insurance:final:reasons1')}`,
        },
        {
            name: 'email',
            icon: <img src="/images/email.png" className="w-[100px] h-[100px]" />,
            description: `${t('insurance:final:get_noti')}`,
            reason: `${t('insurance:final:input_email')}`,
        },
    ]

    return (
        name &&
        noti.map((item, index) => {
            if (item.name === name) {
                return (
                    <div
                        key={index}
                        className={`${
                            index != 3 && 'divide-[#E5E7E8] divide-y '
                        }text-sm border border-1 border-white max-w-md mx-auto h-full rounded-xl shadow-2xl`}
                    >
                        <div className="flex flex-col justify-center items-center my-[24px]">
                            {noti[index].icon}
                            <div className="text-center w-[70%] pt-[24px]">
                                {noti[index].description} <span className="text-[#EB2B3E]">{name != 'success' && name != 'email' ? id : ''}</span>{' '}
                                {noti[index].sub_Description}
                                {noti[index].reason && <div className="text-center text-[#808890]">{noti[index].reason}</div>}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center mx-[24px]">
                            {index < 3 && (
                                <>
                                    <div className="flex flex-row justify-between py-[16px] px-[8px]">
                                        <div className={'text-[#808890]'}>Q-Claim</div>
                                        <div className={'font-semibold flex flex-row hover:cursor-pointer'}>
                                            {0}
                                            <span className={'text-[#EB2B3E]'}>USDT</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between py-[16px] px-[8px] ">
                                        <div className={'text-[#808890]'}>R-Claim</div>
                                        <div className={'font-semibold'}>
                                            <span>{0}%</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {index == 3 && (
                                <>
                                    <div className={''}>
                                        <span className="pb-[8px]">Email</span>
                                        <Input
                                            className={'w-full bg-[#F7F8FA] py-[12px] px-[16px]'}
                                            type={'email'}
                                            inputName={'Loại tài sản và số lượng tài sản'}
                                            idInput={''}
                                            value={email && email}
                                            onChange={(e: any) => {
                                                setEmail(e.target.value)
                                            }}
                                            placeholder={`${t('insurance:final:label_email')}`}
                                        />
                                        <div className="py-[16px] flex  items-center">
                                            <input type="checkbox" className="w-[24px] h-[24px] mr-[8px]" />
                                            {t('insurance:final:hidden_noti')}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-center items-center">
                                <Button
                                    variants={'primary'}
                                    className={`bg-[#EB2B3E] w-[80%] m-[24px] mt-[32px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                >
                                    {index == 0
                                        ? `${t('insurance:final:complete')}`
                                        : index == 3
                                        ? `${t('insurance:final:confirm_email')}`
                                        : `${t('insurance:final:buy_again')}`}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        })
    )
}

export default NotificationInsurance
