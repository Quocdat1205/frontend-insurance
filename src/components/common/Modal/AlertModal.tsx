import classnames from 'classnames'
import React, { useState, useImperativeHandle, useEffect, forwardRef, useRef } from 'react'
import Modal from './Modal'

interface AlertModal {
    portalId: string
}

const AlertModal = forwardRef(({ portalId }: AlertModal, ref) => {
    const [isVisible, setVisible] = useState(false)

    const options = useRef<any>({
        type: '',
        title: '',
        messages: '',
        note: '',
    })
    const actions = useRef<any>({
        onConfirm: null,
        onCancel: null,
    })

    useImperativeHandle(ref, () => ({
        show: onShow,
    }))

    const onShow = (type: string, title: string, messages: string, note: string, onConfirm: () => void, onCancel: () => void, _options: any) => {
        options.current = { type, title, messages, note, ..._options }
        actions.current.onConfirm = onConfirm
        actions.current.onCancel = onCancel
        setVisible(true)
    }

    // const onConfirm = () => {
    //     if (actions.current.onConfirm) actions.current.onConfirm()
    //     options.current = {}
    //     setVisible(false)
    // }

    // const onCancel = () => {
    //     options.current = {}
    //     if (actions.current.onCancel) actions.current.onCancel()
    //     setVisible(false)
    // }

    return (
        <Modal portalId={portalId} isVisible={isVisible}>
            23232
        </Modal>
    )
})

export default AlertModal
