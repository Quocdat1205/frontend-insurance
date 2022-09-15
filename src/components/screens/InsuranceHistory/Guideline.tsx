import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import Tour from 'reactour'
import styled from 'styled-components'
import { X } from 'react-feather'
import { LeftArrow } from 'components/common/Svg/SvgIcon'
import Button from 'components/common/Button/Button'

interface Guideline {
    start: boolean
    setStart: (e: boolean) => void
}
const Guideline = ({ start, setStart }: Guideline) => {
    const { t } = useTranslation()
    const step = useRef<number>(0)
    const refGuide = useRef<any>(null)
    const [flag, setFlag] = useState<boolean>(false)

    const getCurrentStep = (e: number) => {
        if (e === 0) {
            const _el = document.querySelector('#tour_statistics')
            if (_el) _el.scrollIntoView()
        }
        if (e === 1) {
            const _el = document.querySelector('#filter-contract')
            if (_el) _el.scrollIntoView()
        }
        step.current = e
        setFlag(!flag)
    }

    useEffect(() => {
        if (start) {
            const _el = document.querySelector('#tour_statistics')
            if (_el) _el.scrollIntoView()
        }
    }, [start])

    const contentStep1 = () => {
        return (
            <>
                <div>*Q-Claim: {t('insurance:terminology:q_claim')}</div>
                <div>*R-Claim: {t('insurance:terminology:r_claim')}</div>
            </>
        )
    }
    const contentStep2 = () => {
        return (
            <>
                <div>*P-Claim: {t('insurance:terminology:p_claim')}</div>
                <div>*Q-Claim: {t('insurance:terminology:q_claim')}</div>
                <div>*Margin: {t('insurance:terminology:margin')}</div>
            </>
        )
    }

    const tourConfig: any = useMemo(() => {
        return [
            {
                selector: '[data-tut="tour_statistics"]',
                content: (props: any) => (
                    <Content title={t('insurance_history:guidelines:step_title_1')} content={contentStep1()} {...props} top onClose={onClose} />
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_insurance_contract"]',
                content: (props: any) => (
                    <Content title={t('insurance_history:guidelines:step_title_2')} content={contentStep2()} {...props} top onClose={onClose} />
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_guideline"]',
                content: (props: any) => <Content title={t('insurance_history:guidelines:step_title_3')} {...props} top onClose={onClose} />,
                position: 'bottom',
            },
        ]
    }, [])

    const onClose = (e: boolean) => {
        if (!e) {
            if (refGuide.current.state.current === tourConfig.length - 1) {
                setStart(false)
            } else {
                refGuide.current.nextStep()
            }
        } else {
            setStart(false)
        }
    }

    return (
        <Tour
            onRequestClose={() => onClose(false)}
            steps={tourConfig}
            isOpen={start}
            showCloseButton={false}
            className={step.current === 2 ? 'reactour__arrow__right' : ''}
            maskClassName="guideline"
            rounded={6}
            startAt={0}
            maskSpace={2}
            disableInteraction
            disableKeyboardNavigation
            getCurrentStep={getCurrentStep}
            showNavigation={false}
            showButtons={false}
            showNumber={false}
            ref={refGuide}
            onAfterOpen={disableBodyScroll}
            onBeforeClose={enableBodyScroll}
            // inViewThreshold={100}
        />
    )
}

const Content = ({ title, content, step, onClose, top, goTo, ...props }: any) => {
    const { t } = useTranslation()
    return (
        <div className="">
            <div className="relative">
                <div id={`guideline-step-${step}`} className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                        {step > 1 ? (
                            <div className="cursor-pointer" onClick={() => goTo(step - 2)}>
                                <LeftArrow />
                            </div>
                        ) : (
                            <div />
                        )}
                        <div className="text-sm text-red font-medium">{step + '/3'}</div>
                        <div className="cursor-pointer" onClick={() => onClose(true)}>
                            <X width={16} />
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="mb-4">{title}</div>
                        <div className="mb-3">{content}</div>
                    </div>
                    <Button onClick={() => onClose(step === 3)} variants="primary" className="text-xs py-2 w-full">
                        {t(step === 3 ? 'insurance_history:guidelines:got_it' : 'common:next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const View = styled.div.attrs({
    className: '',
})``

export default Guideline
