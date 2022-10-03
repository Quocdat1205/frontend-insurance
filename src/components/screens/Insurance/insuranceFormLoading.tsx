import Skeleton from 'components/common/Skeleton/Skeleton'
import CardShadow from 'components/common/Card/CardShadow'
import React from 'react'

export const InsuranceFormLoading = ({ isMobile }: any) => {
    return !isMobile ? (
        <>
            <div className="max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg m-auto">
                <div className="max-w-screen-layout 4xl:max-w-screen-3xl m-auto px-[5rem] mt-[4rem] mb-5 flex items-center justify-between">
                    <div className="flex items-center font-semibold">
                        <Skeleton className="h-6 w-[12.5rem]" />
                    </div>
                    <div className="flex items-center font-semibold">
                        <Skeleton className="h-6 w-[12.5rem]" />
                    </div>
                </div>
                <div className={'flex flex-col justify-center items-center mb-8 max-w-screen-layout 4xl:max-w-screen-3xl m-auto'}>
                    <div className="flex items-center font-semibold">
                        <Skeleton className="h-6 w-[12.5rem]" />
                    </div>
                    <div className="flex items-center font-semibold mt-[24px]">
                        <Skeleton className="h-9 w-[12.5rem]" />
                    </div>
                </div>
                <CardShadow
                    mobileNoShadow
                    className="px-4 py-6 sm:p-6 flex sm:flex-col sm:space-y-4 space-x-2 sm:space-x-0 min-w-full sm:min-w-[300px] flex-1 border-b border-divider sm:border-none "
                >
                    <div>
                        <div className={'pb-2 text-sm leading-5 text-txtSecondary flex flex-row justify-start items-center'}>
                            <div className={'w-1/2 flex flex-row items-center'}>
                                <Skeleton className="h-6 w-[12.5rem]" />
                            </div>
                        </div>
                        <div className={'pb-2 space-x-6 flex justify-between'}>
                            <div className={` flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                                <Skeleton className="h-9 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row w-full space-x-6 text-xs font-semibold">
                        <div className={`flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer`}>
                            <Skeleton className="h-6 w-[95%]" />
                        </div>
                        <div className={'flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer'}>
                            <Skeleton className="h-6 w-[95%]" />
                        </div>
                        <div className={'flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer'}>
                            <Skeleton className="h-6 w-[95%]" />
                        </div>
                        <div className={'flex flex-col space-y-3 justify-center w-1/4 items-center hover:cursor-pointer'}>
                            <Skeleton className="h-6 w-[95%]" />
                        </div>
                    </div>
                    <div className="mt-6 mb-4">
                        <div className={'flex flex-row relative'}>
                            <Skeleton className="h-80 w-full" />
                        </div>

                        <div className={'flex flex-row justify-between items-center w-full mt-5'}>
                            {[1, 2, 3, 4, 5, 6, 7].map((key) => {
                                return <Skeleton key={key} className="h-6 w-[10%]" />
                            })}
                        </div>
                        <div className={'my-[24px] text-sm'}>
                            <span className={'flex flex-row items-center mr-[4px] text-txtSecondary'}>
                                <Skeleton className="h-6 w-[12.5rem]" />
                            </span>
                            <div className={`mt-[8px] flex justify-between border-collapse rounded-[3px] shadow-none text-base `}>
                                <Skeleton className="h-9 w-[full]" />
                            </div>
                        </div>
                    </div>
                    <div className={'mt-5 text-sm '} data-tut="tour_period" id="tour_period">
                        <span className="flex flex-row items-center text-txtSecondary">
                            <Skeleton className="h-6 w-[12.5rem]" />
                        </span>

                        <div className={`flex flex-row mt-4 space-x-3  w-full `}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((key) => {
                                return <Skeleton key={key} className="h-6 w-[12.5rem]" />
                            })}
                        </div>
                    </div>
                    <div
                        className={
                            'max-w-screen-md lg:max-w-screen-md xl:max-w-screen-lg m-auto flex flex-row justify-center items-center mt-[24px] hover:cursor-default z-50 space-x-2 xl:space-x-3'
                        }
                    >
                        <div className={` flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-divider border-0.5 px-5 py-4`}>
                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                <Skeleton className="h-6 w-[18rem]" />
                            </div>
                        </div>
                        <div className={` flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-divider border-0.5 px-5 py-4`}>
                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                <Skeleton className="h-6 w-[18rem]" />
                            </div>
                        </div>
                        <div className={` flex flex-row justify-between items-center w-[33%] rounded-[12px] border border-divider border-0.5 px-5 py-4`}>
                            <div className={'text-txtSecondary flex flex-row items-center'}>
                                <Skeleton className="h-6 w-[18rem]" />
                            </div>
                        </div>
                    </div>
                </CardShadow>
                <div className={'text-txtSecondary flex justify-center mt-[24px] items-center'}>
                    <Skeleton className="h-6 w-[12.5rem]" />
                </div>
                <div className={`flex flex-col justify-center items-center my-[48px] max-w-screen-layout 4xl:max-w-screen-3xl m-auto`}>
                    <Skeleton className="h-6 w-[12.5rem]" />
                    <Skeleton className="h-6 w-[12.5rem]" />
                </div>
            </div>
        </>
    ) : (
        <div className="px-4 mb:px-10 lg:px-20">
            <div className="pt-12 sm:pt-[4.25rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-1/5" />

                    <Skeleton className="h-6 w-3/5" />
                </div>
            </div>
            <div className="pt-[1rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-full" />
                </div>
            </div>
            <div className="pt-[1rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>

            <div className={'pt-[1rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto flex flex-row justify-between'}>
                {[1, 2, 3, 4, 5, 6, 7].map((key) => {
                    return <Skeleton key={key} className="h-6 w-[10%]" />
                })}
            </div>
            <div className={'py-[1rem] text-sm leading-5 text-txtSecondary flex flex-row justify-start items-center'}>
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Skeleton className="h-6 w-[4rem]" />
                </div>
            </div>
            <div className={' space-x-6 flex justify-between'}>
                <div className={` flex justify-between border-collapse rounded-[3px] shadow-none w-full`}>
                    <Skeleton className="h-9 w-full" />
                </div>
            </div>
            <div className={'pt-[1rem] text-sm leading-5 text-txtSecondary flex flex-row justify-start items-center'}>
                <div className={'w-1/2 flex flex-row items-center'}>
                    <Skeleton className="h-6 w-[4rem]" />
                </div>
            </div>
            <div className={'pt-[1rem] max-w-screen-layout 4xl:max-w-screen-3xl m-auto flex flex-row justify-between'}>
                {[1, 2, 3, 4, 5, 6, 7].map((key) => {
                    return <Skeleton key={key} className="h-6 w-[10%]" />
                })}
            </div>
        </div>
    )
}

export default InsuranceFormLoading
