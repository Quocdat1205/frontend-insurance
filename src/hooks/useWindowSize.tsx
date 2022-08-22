import { useState, useEffect, useRef } from 'react'

interface Size {
    width: number | undefined
    height: number | undefined
}

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<Size>({
        width: undefined,
        height: undefined,
    })
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return windowSize
}
