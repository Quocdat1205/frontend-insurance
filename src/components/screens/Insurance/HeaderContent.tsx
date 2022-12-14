import { Popover } from '@headlessui/react'
import { LeftArrow } from 'components/common/Svg/SvgIcon'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import cx from 'classnames'
import Button from 'components/common/Button/Button'
import Config from 'config/config'

const HeaderContent = ({ state, setState, auth }: any) => {
    const [isDrop, setDrop] = useState<boolean>(false)
    const router = useRouter()
    const {
        t,
        i18n: { language },
    } = useTranslation()

    return (
        <div
            className={`max-w-screen-layout 4xl:max-w-screen-3xl  mt-[2rem] ${
                auth ? 'mb-[3rem] ' : 'mb-[1rem] '
            } grid grid-cols-12 content-center items-start justify-between`}
            onClick={() => {
                setDrop(false)
            }}
        >
            {/* <div
                className=" flex items-center font-semibold col-span-4 hover:cursor-pointer"
                onClick={() => {
                    return router.push('/home')
                }}
            >
                <LeftArrow />
                <span className={'hover:cursor-pointer ml-2'}>{t('insurance:buy:back_to_home')}</span>
            </div> */}

            <div
                className={'flex flex-col justify-center items-center col-span-4 col-start-5'}
                onClick={() => {
                    setDrop(false)
                }}
            >
                <div className={'font-semibold text-[32px] leading-[44px]'}>{t('insurance:buy:buy_covered')}</div>
                {auth == null && <div className={'mt-[12px]'}>{t('insurance:buy:connect_wallet_error')}</div>}
                {
                    //checkAuth
                    auth == null ? (
                        <div className="w-full mt-[2rem] flex flex-col justify-center items-center max-w-screen-layout 4xl:max-w-screen-3xl m-auto mb-[1rem]">
                            <Button
                                variants={'primary'}
                                className={`bg-red h-[40.5rem] w-[374px] flex justify-center items-center text-white rounded-[0.5rem] py-[12px]`}
                                onClick={() => {
                                    Config.connectWallet()
                                }}
                            >
                                {t('insurance:buy:connect_wallet')}
                            </Button>
                        </div>
                    ) : (
                        ''
                    )
                }
            </div>

            <Popover className="relative col-span-4 flex justify-end" data-tut="tour_custom" id="tour_custom">
                <Popover.Button
                    className={cx('rounded-md h-10 py-2 px-3 flex items-center space-x-2 bg-hover', {
                        'bg-[#EDEEF0]': isDrop,
                    })}
                    onClick={() => setDrop(!isDrop)}
                >
                    <span>{state ? (state === 0 ? t('insurance:buy:default') : t('insurance:buy:change_margin')) : t('insurance:buy:default')}</span>
                    {!isDrop ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Popover.Button>
                <Popover.Panel className="absolute z-50 bg-white w-[260px] py-1 right-0 top-[48px] rounded shadow">
                    {({ close }) => (
                        <div className="flex flex-col justify-center h-full ">
                            {[t('insurance:buy:default'), t('insurance:buy:change_margin')].map((e, key) => {
                                let Press = false
                                return (
                                    <div
                                        onClick={() => {
                                            setDrop(false)
                                            setState(key)
                                            close()
                                        }}
                                        key={key}
                                        onMouseDown={() => (Press = true)}
                                        onMouseUp={() => (Press = false)}
                                        className={`${Press ? 'bg-gray-1' : 'hover:bg-hover'}
                        flex flex-row justify-start w-full items-center font-medium hover:cursor-pointer`}
                                    >
                                        <div className={`text-sm flex flex-row justify-between w-full px-4 py-[10px] `}>
                                            <span> {e} </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Popover.Panel>
            </Popover>
        </div>
    )
}

export default HeaderContent
