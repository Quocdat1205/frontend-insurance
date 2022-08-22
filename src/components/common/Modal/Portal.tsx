import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Portal {
    portalId: string
    children: ReactNode
    isVisible?: boolean
}

const Portal = ({ portalId, children, isVisible }: Portal) => {
    const [wrapperElement, setWrapperElement] = useState<any>(null)

    const createWrapperAndAppendToBody = (id: string) => {
        const wrapperElement = document.createElement('div')
        wrapperElement.setAttribute('id', id)
        document.body.appendChild(wrapperElement)
        return wrapperElement
    }

    useEffect(() => {
        let element: any = document.getElementById(portalId)
        let systemCreated = false
        if (!element) {
            systemCreated = true
            element = createWrapperAndAppendToBody(portalId)
        }
        setWrapperElement(element)
        return () => {
            if (systemCreated && element.parentNode && !isVisible) {
                element.parentNode.removeChild(element)
            }
        }
    }, [portalId, isVisible])

    if (!wrapperElement) return null
    return createPortal(children, wrapperElement)
}

export default Portal
