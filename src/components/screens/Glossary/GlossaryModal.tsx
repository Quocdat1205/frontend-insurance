import Modal from 'components/common/Modal/Modal'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import colors from 'styles/colors'
import { StateInsurance } from 'types/types'
import { stateInsurance } from 'utils/constants'
import classnames from 'classnames'
import { CStatus } from 'utils/utils'
import { useTranslation } from 'next-i18next'
import { isMobile } from 'react-device-detect'

interface GlossaryModal {
    visible: boolean
    onClose: () => void
}

const GlossaryModal = ({ visible, onClose }: GlossaryModal) => {
    const { t } = useTranslation()
    const [tab, setTab] = useState<number>(0)

    useEffect(() => {
        setTab(0)
    }, [visible])

    const terms = [
        {
            title: 'Q-Covered',
            description: t('insurance:terminology:q_covered'),
        },
        {
            title: 'P-Market',
            description: t('insurance:terminology:p_market'),
        },
        {
            title: 'P-Claim',
            description: t('insurance:terminology:p_claim'),
        },
        {
            title: 'P-Expired',
            description: t('insurance:terminology:p_expired'),
        },
        {
            title: 'P-Refund',
            description: t('insurance:terminology:p_refund'),
        },
        {
            title: 'Period',
            description: t('insurance:terminology:period'),
        },
        {
            title: 'R-Claim',
            description: t('insurance:terminology:r_claim'),
        },
        {
            title: 'Q-Claim',
            description: t('insurance:terminology:q_claim'),
        },
        {
            title: 'Margin',
            description: t('insurance:terminology:margin'),
        },
        {
            title: 'T-Start',
            description: t('insurance:terminology:t_start'),
        },
        {
            title: 'T-Expired',
            description: t('insurance:terminology:t_expired'),
        },
    ]

    const optionsState = useMemo(() => {
        return Object.keys(stateInsurance).reduce((acc: any[], key: string) => {
            const _key = String(key).toLowerCase()
            acc.push({ title: stateInsurance[key as keyof StateInsurance], description: t(`common:status:explain:${_key}`) })
            return acc
        }, [])
    }, [])

    return (
        <Modal isMobile={isMobile} isVisible={visible} onBackdropCb={onClose} wrapClassName="!p-6" className={'lg:max-w-[600px]'} containerClassName="z-[999]">
            <div className="text-xl font-medium mb-6 sm:mb-8 sm:text-center">{t('insurance:guild:the_glossary')}</div>

            <Tabs tab={tab} className="mb-6 text-sm">
                <TabItem active={tab === 0} onClick={() => setTab(0)}>
                    {t('insurance:buy:detailed_terminology')}
                </TabItem>
                <TabItem active={tab === 1} onClick={() => setTab(1)}>
                    {t('insurance:guild:title2')}
                </TabItem>
            </Tabs>
            <div className="flex flex-col text-sm divide-solid divide-y divide-divider overflow-auto -mx-6 px-6">
                {(!tab ? terms : optionsState).map((item: any, index: number) => (
                    <div key={index} className={`${!tab ? 'py-3' : 'py-[22px]'} flex items-center space-x-6`}>
                        <div className={`whitespace-nowrap ${!tab ? 'min-w-[5rem]' : ''}`}>{!tab ? item.title : <CStatus state={item?.title} t={t} />}</div>
                        <div>{item.description}</div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

const Tabs = styled.div.attrs({
    className: 'mt-6 text-sm sm:text-base flex items-center justify-between h-11 relative after:-bottom-[1px] sm:after:-bottom-[3px]',
})<any>`
    &:after {
        content: '';
        position: absolute;
        height: 2px;
        background-color: ${() => colors.red.red};
        transform: ${({ tab }) => `translate(${tab * 100}%,0)`};
        width: calc(100% / 2);
        transition: all 0.2s;
    }
`

const TabItem = styled.div.attrs<any>(({ active }) => ({
    className: classnames('px-4 py-3 font-medium whitespace-nowrap border-b-[2px] border-divider w-1/2 text-center cursor-pointer', {
        'text-red': active,
        'text-gray': !active,
    }),
}))<any>``

export default GlossaryModal
