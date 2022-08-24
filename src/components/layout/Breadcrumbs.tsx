import React, { Fragment } from 'react'
import { ChevronRight } from 'react-feather'
import colors from 'styles/colors'
const Breadcrumbs = ({ children }: any) => {
    return (
        <div className="bg-hover">
            <div className="max-w-screen-layout m-auto flex items-center space-x-2 text-sm text-txtSecondary py-4 px-10">
                {children.map((child: any, index: number) => (
                    <Fragment key={index}>
                        {child}
                        {index !== children.length - 1 && (
                            <div className="w-6 h-6 flex items-center justify-center">
                                <ChevronRight size={18} color={colors.txtSecondary} />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default Breadcrumbs
