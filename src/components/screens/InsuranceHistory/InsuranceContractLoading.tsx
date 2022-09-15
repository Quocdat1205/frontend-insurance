import CardShadow from 'components/common/Card/CardShadow'
import Skeleton from 'components/common/Skeleton/Skeleton'
import React from 'react'

const InsuranceContractLoading = () => {
    const cols = [1, 2, 3, 4, 5, 6, 7]
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    return (
        <div className="px-4 sm:px-10 lg:px-20">
            <div className="pt-12 sm:pt-[4.25rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-[12rem] sm:w-[25rem]" />
                    <Skeleton className="h-6 w-20 sm:w-[25rem]" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-[3.5rem] space-y-6 sm:space-y-0">
                    <Skeleton className="h-6 w-[12.5rem]" />
                    <div className="flex items-center justify-between space-x-3 sm:space-x-[4rem]">
                        <Skeleton className="h-9 sm:h-4 w-full sm:w-[3rem]" />
                        <Skeleton className="h-9 sm:h-4 w-full sm:w-[3rem]" />
                        <Skeleton className="h-9 sm:h-4 w-full sm:w-[3rem]" />
                    </div>
                </div>
                <div className="flex items-center flex-wrap pt-6 sm:gap-6">
                    <CardShadow
                        mobileNoShadow
                        className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1 border-b border-divider sm:border-none "
                    >
                        <div className="flex items-center sm:space-x-2">
                            <Skeleton className="h-9 sm:h-6 w-9 sm:w-6" />
                            <Skeleton className="h-6 w-[12.5rem] hidden sm:flex " />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                            <div className="flex sm:hidden text-sm">
                                <Skeleton className="h-5 sm:h-6 w-[11rem] sm:w-[12.5rem]" />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[12.5rem]" />
                                <div className="flex items-center space-x-1  font-semibold">
                                    <Skeleton circle className="h-3 w-3" />
                                    <Skeleton className="h-6 w-9" />
                                </div>
                            </div>
                        </div>
                    </CardShadow>
                    <CardShadow
                        mobileNoShadow
                        className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1 border-b border-divider sm:border-none "
                    >
                        <div className="flex items-center sm:space-x-2">
                            <Skeleton className="h-9 sm:h-6 w-9 sm:w-6" />
                            <Skeleton className="h-6 w-[12.5rem] hidden sm:flex" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                            <div className="flex sm:hidden text-sm">
                                <Skeleton className="h-5 sm:h-6 w-[11rem] sm:w-[12.5rem]" />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[12.5rem]" />
                                <div className="flex items-center space-x-1  font-semibold">
                                    <Skeleton circle className="h-3 w-3" />
                                    <Skeleton className="h-6 w-9" />
                                </div>
                            </div>
                        </div>
                    </CardShadow>
                    <CardShadow
                        mobileNoShadow
                        className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1"
                    >
                        <div className="flex items-center sm:space-x-2">
                            <Skeleton className="h-9 sm:h-6 w-9 sm:w-6" />
                            <Skeleton className="h-6 w-[12.5rem] hidden sm:flex" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-1 sm:space-y-0">
                            <div className="flex sm:hidden text-sm">
                                <Skeleton className="h-5 sm:h-6 w-[11rem] sm:w-[12.5rem]" />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[12.5rem]" />
                                <div className="flex items-center space-x-1  font-semibold">
                                    <Skeleton circle className="h-3 w-3" />
                                    <Skeleton className="h-6 w-9" />
                                </div>
                            </div>
                        </div>
                    </CardShadow>
                </div>
                <CardShadow mobileNoShadow className="!mt-6 p-11 hidden sm:block">
                    <div className="flex flex-items-center justify-between space-x-12">
                        <div className="flex flex-col space-y-1 w-full">
                            <Skeleton className="h-4 w-20" />
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[8rem]" />
                                <Skeleton className="h-1 w-2" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 w-full">
                            <Skeleton className="h-4 w-20" />
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[8rem]" />
                                <Skeleton className="h-1 w-2" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 w-full">
                            <Skeleton className="h-4 w-20" />
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[8rem]" />
                                <Skeleton className="h-1 w-2" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1 w-full">
                            <Skeleton className="h-4 w-20" />
                            <div className="flex items-center justify-between w-full">
                                <Skeleton className="h-6 w-[8rem]" />
                                <Skeleton className="h-1 w-2" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-14 flex flex-col space-y-8">
                        <div className="flex items-center justify-between">
                            {cols.map((col: number) => (
                                <div key={col} className={`flex items-center space-x-2 w-[calc(100%/${cols.length})]`}>
                                    <Skeleton className="h-4 w-20" />
                                    <div className="flex flex-col">
                                        <Skeleton className="h-1 w-2" />
                                        <Skeleton className="h-1 w-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between">
                            {cols.map((col: number) => (
                                <div key={col} className={`flex flex-col space-y-8 w-[calc(100%/${cols.length})]`}>
                                    {rows.map((row: number) => (
                                        <div key={row} className={`flex items-center space-x-2 w-full`}>
                                            <Skeleton className="h-8 w-[8rem]" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardShadow>
            </div>
        </div>
    )
}

export default InsuranceContractLoading
