import { useTranslation } from 'next-i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import Tour from 'reactour'
import { X } from 'react-feather'
import { LeftArrow } from 'components/common/Svg/SvgIcon'
import Button from 'components/common/Button/Button'

interface Guideline {
    start: boolean
    setStart: (e: boolean) => void
    seen: boolean
    setShowTerminologyModal: (e: boolean) => void
}
const Guideline = ({ start, setStart, seen, setShowTerminologyModal }: Guideline) => {
    const { t } = useTranslation()
    const step = useRef<number>(0)
    const refGuide = useRef<any>(null)
    const [flag, setFlag] = useState<boolean>(false)
    const timer = useRef<any>(null)

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
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                document.body.classList.add('overflow-hidden')
            }, 300)
        } else {
            document.body.classList.remove('overflow-hidden')
        }
    }, [start])

    const onShowGlossary = (e: any) => {
        let el = e?.target
        while (el && el !== e.currentTarget && el.tagName !== 'SPAN') {
            el = el.parentNode
        }
        if (el && el.tagName === 'SPAN') {
            setShowTerminologyModal(true)
        }
    }

    const tourConfig: any = useMemo(() => {
        return [
            {
                selector: '[data-tut="tour_statistics"]',
                content: (props: any) => (
                    <Content
                        title={t('insurance_history:guidelines:step_title_1')}
                        content={t('insurance_history:guidelines:step_content_1')}
                        {...props}
                        top
                        onClose={onClose}
                        seen={seen}
                    />
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_insurance_contract"]',
                content: (props: any) => (
                    <Content
                        title={t('insurance_history:guidelines:step_title_2')}
                        content={t('insurance_history:guidelines:step_content_2')}
                        {...props}
                        top
                        onClose={onClose}
                        seen={seen}
                    />
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_hashID"]',
                content: (props: any) => (
                    <Content
                        title={t('insurance_history:guidelines:step_title_3')}
                        content={t('insurance_history:guidelines:step_content_3')}
                        {...props}
                        top
                        onClose={onClose}
                        seen={seen}
                    />
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_status"]',
                content: (props: any) => (
                    <Content
                        title={t('insurance_history:status')}
                        content={t('insurance_history:guidelines:step_content_4', {
                            value: `<span class='text-red underline'>${t('insurance:guild:the_glossary')}</span>`,
                        })}
                        {...props}
                        top
                        onClose={onClose}
                        seen={seen}
                        onClick={onShowGlossary}
                    />
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tut="tour_guideline"]',
                content: (props: any) => (
                    <Content
                        title={t('insurance_history:guidelines:title')}
                        content={t('insurance_history:guidelines:step_content_5', {
                            value: `<span class='text-red underline'>${t('insurance_history:terminologies_states')}</span>`,
                        })}
                        {...props}
                        top
                        onClose={onClose}
                        seen={seen}
                        onClick={onShowGlossary}
                    />
                ),
                position: 'bottom',
            },
        ]
    }, [seen])

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

    const className = step.current === 2 ? 'reactour__arrow__center' : step.current === 3 || step.current === 4 ? 'reactour__arrow__right' : ''

    return (
        <Tour
            onRequestClose={() => onClose(false)}
            steps={tourConfig}
            isOpen={start}
            showCloseButton={false}
            className={className}
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
            // onAfterOpen={disableBodyScroll}
            // onBeforeClose={enableBodyScroll}
            // inViewThreshold={100}
        />
    )
}

const Content = ({ title, content, step, onClose, top, goTo, seen, onClick }: any) => {
    const { t } = useTranslation()
    const steps = seen ? 4 : 5
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
                        <div className="text-sm text-red font-medium">{step + '/' + steps}</div>
                        <div className="cursor-pointer" onClick={() => onClose(true)}>
                            <X width={16} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="mb-2 font-medium">{title}</div>
                        <div onClick={(e) => onClick && onClick(e)} className="text-sm text-txtSecondary" dangerouslySetInnerHTML={{ __html: content }}></div>
                    </div>
                    <Button onClick={() => onClose(step === steps)} variants="primary" className="text-xs py-2 w-full">
                        {t(step === steps ? 'insurance_history:guidelines:got_it' : 'common:next')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Guideline
