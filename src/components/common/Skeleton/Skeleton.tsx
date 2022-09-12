import classNames from 'classnames'
import React from 'react'
interface Skeleton {
    circle?: boolean
    className?: string
}

const Skeleton = ({ circle, className }: Skeleton) => {
    return <div className={classNames('animate-pulse bg-skeleton rounded-md min-h-[8px] h-full w-full', { '!rounded-full': circle }, className)} />
}

export default Skeleton
