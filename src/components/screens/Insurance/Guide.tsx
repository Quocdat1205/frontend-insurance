import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import styled from 'styled-components'
import { X } from 'react-feather'
import { LeftArrow } from 'components/common/Svg/SvgIcon'
import Button from 'components/common/Button/Button'
import Tour from 'reactour'

interface Guideline {
    start: boolean
    setStart: (e: boolean) => void
}
const Guide = ({ start, setStart }: Guideline) => {
    const { t } = useTranslation()
    const step = useRef<number>(0)
    const refGuide = useRef<any>(null)

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
                <div>*Period: {t('insurance:terminology:period')}</div>
            </>
        )
    }
    const contentStep2 = () => {
        return (
            <>
                <div>*P-Claim: {t('insurance:terminology:p_claim')}</div>
            </>
        )
    }

    const tourConfig: any = useMemo(() => {
        return [
            {
                content: (props: any) => <Content title={'Chọn loại tài sản và số lượng tài sản.'} {...props} top onClose={onClose} />,
                position: 'bottom',
            },
            {
                content: (props: any) => (
                    <Content
                        title={`Chọn nhanh P-Claim bằng cách kéo thả thanh giá trên biểu đồ theo phương dọc hoặc nhập khối lượng P-Claim mong muốn.`}
                        content={contentStep2()}
                        {...props}
                        top
                        onClose={onClose}
                    />
                ),
                position: 'bottom',
            },
            {
                content: (props: any) => (
                    <Content
                        title={`Chọn nhanh P-Claim bằng cách kéo thả thanh giá trên biểu đồ theo phương dọc hoặc nhập khối lượng P-Claim mong muốn.`}
                        content={contentStep2()}
                        {...props}
                        top
                        onClose={onClose}
                    />
                ),
                position: 'bottom',
            },
            {
                content: (props: any) => <Content title={`Chọn period.`} content={contentStep1()} {...props} top onClose={onClose} />,
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
            maskClassName="guideline"
            rounded={6}
            startAt={0}
            maskSpace={2}
            disableInteraction
            disableKeyboardNavigation
            // accentColor={colors.red.red}
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
                        <div className="text-sm text-red font-medium">{step + '/4'}</div>
                        <div className="cursor-pointer" onClick={() => onClose(true)}>
                            <X width={16} />
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="mb-4">{title}</div>
                        <div className="mb-3">{content}</div>
                    </div>
                    <Button onClick={() => onClose(step === 4)} variants="primary" className="text-xs py-2 w-full">
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

export default Guide
