import { useTranslation } from 'next-i18next'
import React, { useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import InputField from 'components/common/Input/InputField'
import CircleSpinner from 'components/common/Loader/CircleSpinner'
import Modal from 'components/common/Modal/Modal'
import Config from 'config/config'
import { API_CONTACT, API_SUBSCRIBE } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { capitalizeFirstLetter } from 'utils/utils'

interface ContactModal {
    visible: boolean
    onClose: () => void
}

const Success = () => {
    const { t } = useTranslation()
    return (
        <>
            <div className="flex flex-col items-center justify-center pb-4 text-xl font-medium">
                <img src="/images/success.png" className="w-[80px] h-[80px]" />
                <div className="pt-6 text-xl text-center">
                    {t('common:modal:contact:send_success_title')}
                    <div className="pt-2 text-sm text-center md:text-base text-txtSecondary">{t('common:modal:contact:send_success_desc')}</div>
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

const initialState = {
    email: '',
    request: '',
}

const ContactModal = ({ visible, onClose }: ContactModal) => {
    const { t } = useTranslation()
    const [reqDetail, setReqDetail] = useState(initialState)

    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleChange = (name: string, event: any) => {
        setReqDetail({ ...reqDetail, [name]: event.target.value })
    }

    const handlePaste = (name: string, event: any) => {
        event.preventDefault()
        const pastedValue = event.clipboardData.getData('text')
        setReqDetail({ ...reqDetail, [name]: pastedValue })
        validator(name, pastedValue)
    }

    const validator = (key: string, value?: '') => {
        const rs = { isValid: false, message: '' }
        switch (key) {
            case 'email':
                rs.isValid = isValidEmail(value || reqDetail?.email)
                rs.message = t('common:modal:error_format_email')
                break
            case 'request':
                rs.isValid = !isNotEmptyString(value || reqDetail?.request)
                break
            default:
                return rs
                break
        }
        return rs
    }

    const fetchContactApi = useCallback(async () => {
        try {
            const { email, request } = reqDetail

            const { data, error, message, statusCode } = await fetchApi({
                url: API_CONTACT,
                options: {
                    method: 'POST',
                },
                params: {
                    email,
                    content: request,
                },
            })
            setIsLoading(false)
            if (statusCode !== 200) {
                Config.toast.show('error', capitalizeFirstLetter(t(`errors:${message}`)))
            }
            if (data) {
                setIsSuccess(true)
            }
        } catch (e) {
            setIsLoading(false)
            Config.toast.show('error', t('home:landing:email_invalid'), {
                position: 'top-right',
            })
        }
    }, [reqDetail])

    const handleSubscribe = async () => {
        if (isLoading) return
        setIsLoading(true)
        await fetchContactApi()
    }

    // Override state because the modal already mounted on header
    const handleOnClose = () => {
        setIsSuccess(false)
        setReqDetail(initialState)
        setIsLoading(false)
        onClose()
    }

    return (
        <Modal
            isMobile={isMobile}
            isVisible={visible}
            onBackdropCb={handleOnClose}
            wrapClassName="!p-6"
            className={'lg:max-w-[600px]'}
            containerClassName="z-1"
        >
            {isSuccess ? (
                // Success modal
                <Success />
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center pt-6 text-xl font-medium md:pt-2 md:pb-6">
                        <img src="/images/icons/ic_gmail.png" className="w-[80px] h-[80px]" />
                        <div className="pt-6 text-xl text-center">
                            {t('common:modal:contact:title')}
                            <div className="pt-2 text-sm text-center md:text-base text-txtSecondary">{t('common:modal:contact:description')}</div>
                        </div>
                    </div>
                    <InputField
                        id={'email'}
                        key={'email'}
                        label={t('common:email')}
                        value={reqDetail?.email || ''}
                        onChange={(e: any) => handleChange('email', e)}
                        onPaste={(e: any) => handlePaste('email', e)}
                        validator={validator('email')}
                        placeholder={`${t('common:modal:email_placeholder')}`}
                    />

                    <InputField
                        isTextArea
                        id={'request'}
                        key={'request'}
                        label={t('common:modal:contact:request')}
                        value={reqDetail?.request || ''}
                        onChange={(e: any) => handleChange('request', e)}
                        onPaste={(e: any) => handlePaste('request', e)}
                        validator={validator('request')}
                        placeholder={`${t('common:modal:contact:request_placeholder')}`}
                    />
                    <div className="flex flex-col px-6 mt-8 -mx-6 overflow-auto text-sm">
                        <div className="flex items-center justify-center text-base">
                            <Button
                                variants={'primary'}
                                className={`h-[48px] ${
                                    isLoading ? 'cursor-default' : 'cursor-pointer'
                                } !w-[374px] flex justify-center items-center text-white rounded-[8px] py-[12px]`}
                                onClick={handleSubscribe}
                                disabled={!reqDetail?.request || !reqDetail?.email || !validator('email')?.isValid}
                            >
                                {isLoading ? (
                                    <>
                                        <CircleSpinner />
                                        {t('common:modal:contact:sending_request')}
                                    </>
                                ) : (
                                    t('common:modal:contact:send_request')
                                )}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    )
}

export default React.memo(ContactModal)
