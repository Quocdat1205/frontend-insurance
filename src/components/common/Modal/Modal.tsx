import classnames from 'classnames'
import useOutsideAlerter, { useOutside } from 'hooks/useOutsideAlerter'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Portal from './Portal'

interface Modal {
    isVisible: boolean
    children: ReactNode
    containerClassName?: string
    className?: string
    onBackdropCb?: () => void
    portalId: string
}

const Modal = ({ isVisible, portalId, children, containerClassName = '', className = '', onBackdropCb }: Modal) => {
    const wrapperRef = useRef<any>(null)
    const container = useRef<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const timer = useRef<any>(null)
    const handleOutside = () => {
        if (isVisible && onBackdropCb) onBackdropCb()
    }

    useOutsideAlerter(wrapperRef, handleOutside)

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
    }, [isVisible])

    return (
        <Portal portalId={portalId} isVisible={isVisible}>
            {loading && (
                <div
                    className={classnames(
                        'fixed top-0 left-0 z-[99] w-full h-full overflow-hidden bg-bgModal/[0.16]',
                        'ease-in transition-all flex duration-300 z-30',
                        { 'invisible translate-y-full': !isVisible },
                        { 'visible translate-y-0': isVisible },
                        containerClassName,
                    )}
                    ref={container}
                >
                    <div ref={wrapperRef} className={`${className} h-max w-full absolute`}>
                        {children}
                    </div>
                </div>
            )}
        </Portal>
    )
}

export default Modal
