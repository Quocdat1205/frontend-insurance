import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Button from 'components/common/Button/Button'
import InputField from 'components/common/Input/InputField'
import Modal from 'components/common/Modal/Modal'
import * as types from 'redux/actions/types'
import { API_GET_INFO_USER, API_GET_UNIT_CONFIG } from 'services/apis'
import fetchApi from 'services/fetch-api'
import Toast from 'components/layout/Toast';
import Config from 'config/config';

interface UpdateEmailSubscriptionModal {
    visible: boolean
    onClose: () => void
}

const isValidEmail = (email: any) =>
    Boolean(
        String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            ),
    )

const isDuplicateEmail = (oldEmail: any, newEmail: any) => newEmail.toLowerCase() === oldEmail.toLowerCase()

const UpdateEmailSubscriptionModal = ({ visible, onClose }: UpdateEmailSubscriptionModal) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [currentEmail, setCurrentEmail] = useState('a@mail.com')
    const [ableSubmit, setAbleSubmit] = useState(false)

    const getInfo = async () => {
        const { data } = await fetchApi({
            url: API_GET_INFO_USER,
            params: {
                owner: '0xFA39a930C7A3D1fEde4E1348FF74c0c5ba93D2B4',
            },
        })
        console.log('fetch---', data)
        if (data) {
            // dispatch({
            //     type: types.SET_CONFIG_UNIT,
            //     payload: data,
            // })
        }
    }

    const updateEmail = async () => {
        Config.toast.show('error', t('home:landing:email_invalid'), {
            position:"top-right"
        })
        return
        const { data } = await fetchApi({
            url: API_GET_INFO_USER,
            baseURL: '',
            method: 'PUT',
            params: {
                owner: '0xFA39a930C7A3D1fEde4E1348FF74c0c5ba93D2B4',
                email: '',
            },
        })
        console.log('update---', data)
        if (data) {
            // dispatch({
            //     type: types.SET_CONFIG_UNIT,
            //     payload: data,
            // })
        }
    }

    useEffect(() => {
        getInfo()
    }, [])

    const handleChange = (event: any) => {
        setEmail(event.target.value)
        if (validator('newEmail').isValid) {
            setAbleSubmit(true)
        } else {
            setAbleSubmit(false)
        }
    }

    const validator = (key: string) => {
        const rs = { isValid: true, message: '' }
        switch (key) {
            case 'newEmail': {
                if (!isValidEmail(email)) {
                    rs.isValid = isValidEmail(email)
                    rs.message = t('common:modal:error_format_email')
                }
                if (isDuplicateEmail(currentEmail, email)) {
                    rs.isValid = false
                    rs.message = t('common:modal:error_duplicate_email')
                }
                break
            }
            default:
                return rs
                break
        }
        return rs
    }

    return (
        <Modal
            isMobile={isMobile}
            isVisible={visible}
            // isVisible={true}
            onBackdropCb={onClose}
            wrapClassName="!p-6"
            className={'lg:max-w-[600px]'}
            containerClassName="z-[9999999]"
        >
            {/* <Toas/> */}
            <div className="flex flex-col justify-center items-center pt-6 pb-6 md:pt-2 text-xl font-medium">
                <img src="/images/email.png" className="w-[80px] h-[80px]" />
                <div className="text-center pt-6 text-xl">
                    {t('common:modal:email_subscription:update_email')}
                    <div className="text-center text-sm md:text-base text-txtSecondary pt-2">{t('common:modal:email_subscription:description')}</div>
                </div>
            </div>
            <InputField
                id={'curEmail'}
                key={'curEmail'}
                label={t('common:modal:email_subscription:current_email')}
                value={currentEmail}
                disabled={true}
                placeholder={`${t('insurance:final:label_email')}`}
            />

            <InputField
                id={'newEmail'}
                key={'newEmail'}
                label={t('common:modal:email_subscription:new_email')}
                onChange={handleChange}
                validator={validator('newEmail')}
                value={email}
                placeholder={`${t('insurance:final:label_email')}`}
            />
            <div className="flex justify-center items-center text-base ">
                <Button
                    variants={'primary'}
                    className={`mt-4 !w-full h-[48px] !w-[374px] flex justify-center items-center text-white rounded-[8px]`}
                    onClick={() => {
                        if (email || ableSubmit) {
                            return updateEmail()
                        }
                        // if (3 === 3) {
                        //     // return handleAPISubscribe(email)
                        // }
                        // if (index != 0 && index != 3) {
                        //     return router.push('/buy-covered/insurance-history')
                        // }
                    }}
                    disable={!email || !ableSubmit}
                >
                    {t('common:update')}
                </Button>
                {/* </div> */}
            </div>
        </Modal>
    )
}

export default UpdateEmailSubscriptionModal
