import classnames from 'classnames'
import useOutsideAlerter, { useOutside } from 'hooks/useOutsideAlerter'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { X } from 'react-feather'
import { PORTAL_MODAL_ID } from 'utils/constants'
import Portal from './Portal'

interface Modal {
    isVisible: boolean
    children: ReactNode
    containerClassName?: string
    className?: string
    onBackdropCb?: () => void
    portalId?: string
    isMobile?: boolean
    customHeader?: () => void
    wrapClassName?: string
}

const Modal = ({
    isVisible,
    portalId = PORTAL_MODAL_ID,
    children,
    containerClassName = '',
    className = '',
    onBackdropCb,
    isMobile,
    customHeader,
    wrapClassName = '',
}: Modal) => {
    const wrapperRef = useRef<any>(null)
    const container = useRef<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const timer = useRef<any>(null)

    const handleOutside = () => {
        if (isVisible && onBackdropCb) onBackdropCb()
    }

    useOutside(wrapperRef, handleOutside, container)
    // useOutsideAlerter(wrapperRef, handleOutside)

    useEffect(() => {
        clearTimeout(timer.current)
        timer.current = setTimeout(
            () => {
                setLoading(isVisible)
            },
            isVisible ? 0 : 500,
        )
        const hidding = document.body.classList.contains('overflow-hidden')
        if (hidding) return
        if (isVisible) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
        return () => {
            if (!hidding) document.body.classList.remove('overflow-hidden')
        }
    }, [isVisible, isMobile])

    return (
        <Portal portalId={portalId} isVisible={isVisible}>
            <div
                className={classnames(
                    'fixed top-0 left-0 z-[99] w-full h-full overflow-hidden bg-bgModal/[0.3]',
                    'z-30',
                    {
                        invisible: !isVisible,
                        visible: isVisible,
                    },
                    containerClassName,
                )}
                ref={container}
            >
                <div
                    className={classnames('h-full relative ease-in transition-all flex duration-300', {
                        'translate-y-full': !isVisible,
                        'translate-y-0': isVisible,
                        'flex flex-col justify-end': isMobile,
                    })}
                >
                    {loading && (
                        <div
                            ref={wrapperRef}
                            className={classnames(
                                'w-full absolute bg-white',
                                { 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl': !isMobile },
                                className,
                            )}
                        >
                            <div className={`py-8 px-6 ${wrapClassName}`}>
                                <>
                                    {customHeader ? (
                                        customHeader()
                                    ) : (
                                        <div className="flex items-center justify-end pb-6 sm:pb-2">
                                            <X onClick={handleOutside} size={20} className="cursor-pointer" />
                                        </div>
                                    )}
                                    {children}
                                </>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Portal>
    )
}

export default Modal
