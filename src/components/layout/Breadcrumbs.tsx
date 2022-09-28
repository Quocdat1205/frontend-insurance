import { Fragment, useEffect, useState } from 'react'
import { ChevronRight } from 'react-feather'
import colors from 'styles/colors'
import { isMobile } from 'react-device-detect'
const Breadcrumbs = ({ children }: any) => {
    const [mount, setMount] = useState<boolean>(false)
    useEffect(() => {
        setMount(!mount)
    }, [])

    if (!mount) return null
    return (
        <div className="bg-hover px-4 mb:px-10">
            <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto flex items-center flex-wrap text-xs sm:text-sm text-txtSecondary py-2 sm:py-4 ">
                {children.length ? (
                    children.map((child: any, index: number) => (
                        <Fragment key={index}>
                            {child}
                            {index !== children.length - 1 && (
                                <div className="w-6 h-6 flex items-center justify-center sm:mx-2">
                                    <ChevronRight size={isMobile ? 14 : 18} color={colors.txtSecondary} />
                                </div>
                            )}
                        </Fragment>
                    ))
                ) : (
                    <Fragment>{children}</Fragment>
                )}
            </div>
        </div>
    )
}

export default Breadcrumbs
