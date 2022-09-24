import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import InputField  from 'components/common/Input/InputField'
import Modal from 'components/common/Modal/Modal'

interface ContactModal {
    visible: boolean
    onClose: () => void
}

const Success = () => {
    const { t } = useTranslation()
    return (
        <>
            <div className="flex flex-col justify-center items-center pb-4  text-xl font-medium">
                <img src="/images/success.png" className="w-[80px] h-[80px]" />
                <div className="text-center pt-6 text-xl">
                    {t('common:modal:contact:send_success_title')}
                    <div className="text-center text-sm md:text-base text-txtSecondary pt-2">{t('common:modal:contact:send_success_desc')}</div>
                </div>
            </div>
        </>
    )
}

const isValidEmail = (email: any) =>
    !!String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        )

const isNotEmptyString = (str: any) => !!String(str).trim()

const ContactModal = ({ visible, onClose }: ContactModal) => {
    const { t } = useTranslation()
    const [reqDetail, setReqDetail] = useState({
        email: '',
        request: '',
    })
    const [request, setRequest] = useState('')

    const handleChange = (name: string, event: any) => {
        setReqDetail({ ...reqDetail, [name]: event.target.value })
    }

    const validator = (key: string) => {
        const rs = { isValid: true, message: '' }
        switch (key) {
            case 'email':
                rs.isValid = isValidEmail(reqDetail?.email)
                rs.message = t('common:modal:error_format_email')
                break
            case 'request':
                rs.isValid = !isNotEmptyString(reqDetail?.request)
                break
            // rs.message = t('common:modal:contact:title')
            default:
                return rs
                break
        }
        return rs
    }

    return (
        <Modal isMobile={isMobile} isVisible={true} onBackdropCb={onClose} wrapClassName="!p-6" className={'lg:max-w-[600px]'} containerClassName="z-[9999999]">
            {/* <Success/> */}
            <div className="flex flex-col justify-center items-center pt-6 md:pt-2 text-xl font-medium">
                <img src="/images/email.png" className="w-[80px] h-[80px]" />
                <div className="text-center pt-6 text-xl">
                    {t('common:modal:contact:title')}
                    <div className="text-center text-sm md:text-base text-txtSecondary pt-2">{t('common:modal:contact:description')}</div>
                </div>
            </div>
            {/* <div className="text-xl font-medium mb-6 sm:mb-8 sm:text-center">{t('common:modal:dont_show_later')}</div> */}
            {/* <ErrorSectionNote content={t('common:modal:email_subscription:ignore_description')} /> */}

            <InputField
                id={'email'}
                key={'email'}
                label={t('common:email')}
                value={reqDetail?.email || ''}
                onChange={(e: any) => handleChange('email', e)}
                validator={validator('email')}
                placeholder={`${t('insurance:final:label_email')}`}
            />

            <InputField
                isTextArea
                id={'request'}
                key={'request'}
                label={t('common:modal:contact:request')}
                value={reqDetail?.request || ''}
                onChange={(e: any) => handleChange('request', e)}
                validator={validator('request')}
                placeholder={`${t('common:modal:contact:request_placeholder')}`}
            />
            {/* <div className="flex flex-col text-sm divide-solid divide-y divide-divider overflow-auto -mx-6 px-6"> */}
            <div className="flex flex-col text-sm overflow-auto -mx-6 px-6">
                <div className="flex justify-center items-center text-base">
                    <Button
                        variants={'primary'}
                        className={`!w-full h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                        onClick={() => {
                            // if (3 === 3) {
                            //     // return handleAPISubscribe(email)
                            // }
                            // if (index != 0 && index != 3) {
                            //     return router.push('/buy-covered/insurance-history')
                            // }
                        }}
                        disable={!reqDetail?.request || !reqDetail?.email || !!(validator && Object.keys(validator)?.length && !validator('email')?.isValid)}
                    >
                        {t('common:update')}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ContactModal
