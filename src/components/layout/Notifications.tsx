import { Transition } from '@headlessui/react'
import Modal from 'components/common/Modal/Modal'
import Skeleton from 'components/common/Skeleton/Skeleton'
import { NotificationsIcon } from 'components/common/Svg/SvgIcon'
import useOutsideAlerter from 'hooks/useOutsideAlerter'
import useWeb3Wallet from 'hooks/useWeb3Wallet'
import { useTranslation } from 'next-i18next'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { API_CHECK_NOTICE, API_GET_NOTICE, API_UPDATE_NOTICE } from 'services/apis'
import fetchApi from 'services/fetch-api'
import { getTimeAgo } from 'utils/utils'
import { isMobile } from 'react-device-detect'
import { renderContentStatus } from 'components/screens/InsuranceHistory/InsuranceContract'
import { X } from 'react-feather'

const Notifications = () => {
    const { account } = useWeb3Wallet()
    const { t } = useTranslation()
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const wrapperRef = useRef<any>(null)
    const [hasNotice, setHasNotice] = useState<boolean>(false)
    const [showNotiDetail, setShowNotiDetail] = useState<boolean>(false)
    const rowData = useRef(null)
    const filter = useRef({
        skip: 0,
        limit: 10,
        isAll: false,
    })
    const [dataSource, setDataSource] = useState({
        list_notice: [],
        count: 0,
    })

    const handleOutside = () => {
        if (!isMobile) setVisible(false)
    }

    useOutsideAlerter(wrapperRef, handleOutside)

    useEffect(() => {
        if (visible) {
            filter.current.skip = 0
            getNotice()
        }
    }, [visible])

    useEffect(() => {
        checkNotice()
    }, [])

    const checkNotice = async () => {
        try {
            const { data } = await fetchApi({
                url: API_CHECK_NOTICE,
                options: { method: 'GET' },
                params: {
                    owner: account,
                },
            })
            if (data) {
                setHasNotice(data)
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const updateNotice = async (id: number) => {
        try {
            await fetchApi({
                url: API_UPDATE_NOTICE,
                options: { method: 'PUT' },
                params: {
                    _id: id,
                },
            })
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const getNotice = async () => {
        setLoading(true)
        try {
            const { data } = await fetchApi({
                url: API_GET_NOTICE,
                options: { method: 'GET' },
                params: {
                    owner: account,
                    ...filter.current,
                },
            })
            if (data) {
                const dataFiter = !filter.current.skip ? data?.list_notice : dataSource.list_notice.concat(data?.list_notice)
                setDataSource({
                    count: data?.count,
                    list_notice: dataFiter,
                })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const loader = () => {
        return [1, 2, 3, 4].map((index: number) => (
            <div key={index} className="flex items-center sm:px-6 py-4 space-x-4 hover:bg-hover">
                <div className="min-w-[40px] min-h-[40px]">
                    <Skeleton circle className="w-10 h-10" />
                </div>
                <div className="flex flex-col space-y-[2px]">
                    <Skeleton className="w-40 h-3" />
                    <Skeleton className="w-10 h-1" />
                </div>
            </div>
        ))
    }

    const onShowDetail = (item: any) => {
        if (!item?.isConfirm) updateNotice(item?._id)
        rowData.current = item
        setShowNotiDetail(true)
        setVisible(false)
    }

    const renderNoti = () => {
        return loading
            ? loader()
            : dataSource.list_notice?.map((item: any, index: number) => {
                  return (
                      <div onClick={() => onShowDetail(item)} key={index} className="flex items-center sm:px-6 py-4 space-x-4 mb:hover:bg-hover">
                          <div className="min-w-[40px] min-h-[40px]">
                              <img src={`/images/icons/${item?.isConfirm ? 'ic_noti_active' : 'ic_noti_inactive'}.png`} width="40" height="40" />
                          </div>
                          <div className="flex flex-col space-y-[2px]">
                              <div
                                  className="text-sm"
                                  dangerouslySetInnerHTML={{
                                      __html: t('common:notification:notice_message', {
                                          id: item?._id,
                                          status: t(`common:notification:status:${String(item?.state).toLowerCase()}`),
                                      }),
                                  }}
                              ></div>
                              <span className="text-xs leading-[1rem] text-gray">{getTimeAgo(item?.createdAt)}</span>
                          </div>
                          {!item?.isConfirm && <div className="min-w-[6px] min-h-[6px] bg-red rounded-[50%]" />}
                      </div>
                  )
              })
    }

    return (
        <div ref={wrapperRef} className="relative">
            <NotiDetailModal isMobile={isMobile} data={rowData.current} visible={showNotiDetail} onClose={() => setShowNotiDetail(false)} t={t} />
            <div onClick={() => setVisible(true)} className="sm:p-2 hover:bg-hover rounded-[3px] relative">
                <NotificationsIcon />
                {hasNotice && <div className="bg-red w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-[50%] absolute top-[30%] right-[20%] sm:right-[30%]" />}
            </div>
            {isMobile ? (
                <Modal
                    isMobile
                    containerClassName="flex-col justify-end !bg-transparent"
                    className="h-[calc(100%-4rem)]"
                    wrapClassName="!px-4 !py-8"
                    isVisible={visible}
                    onBackdropCb={() => setVisible(false)}
                    customHeader={() => (
                        <div className="flex items-center justify-between mb-6">
                            <div className="font-medium text-2xl">{t('common:notification:title')}</div>
                            <X onClick={() => setVisible(false)} size={20} className="cursor-pointer" />
                        </div>
                    )}
                >
                    <div className="overflow-hidden relative flex flex-col space-y-2">{renderNoti()}</div>
                </Modal>
            ) : (
                <Transition
                    show={visible}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <div className={'absolute z-10 mt-3 left-0 shadow-subMenu rounded-xl min-w-[360px] py-1 bg-white'}>
                        <div className="overflow-hidden font-normal">{renderNoti()}</div>
                    </div>
                </Transition>
            )}
        </div>
    )
}

const NotiDetailModal = ({ visible, onClose, data, t, isMobile }: any) => {
    return (
        <Modal
            isMobile={true}
            isVisible={visible}
            onBackdropCb={onClose}
            className={!isMobile ? 'rounded-xl bg-white max-w-[424px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
        >
            <div className="overflow-hidden relative sm:-m-6"> {renderContentStatus(data, t)}</div>
        </Modal>
    )
}

export default Notifications
