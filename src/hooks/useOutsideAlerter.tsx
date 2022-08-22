import { useEffect } from 'react'

const useOutsideAlerter = (ref: any, cb: any) => {
    useEffect(() => {
        const handleClickOutside = (event?: any, cb?: any) => {
            if (ref.current && !ref.current?.contains(event.target)) {
                cb()
            }
        }
        document.addEventListener('mousedown', (event) => handleClickOutside(event, cb))
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, cb])
}
export default useOutsideAlerter

export const useOutside = (ref: any, cb: any, container: any) => {
    useEffect(() => {
        
        const handleClickOutside = (event: any, cb: any) => {
            if (ref.current && !ref.current?.contains(event.target)) {
                cb()
            }
        }
        if (container?.current) {
            container?.current?.addEventListener('mousedown', (event: any) => handleClickOutside(event, cb))
        }
        return () => {
            if (container?.current) {
                container?.current?.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [ref, cb, container])
}
