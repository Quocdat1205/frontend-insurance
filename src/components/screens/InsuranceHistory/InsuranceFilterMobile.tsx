import classnames from 'classnames'
import Button from 'components/common/Button/Button'
import DateRangePickerMobile from 'components/common/DatePicker/DateRangePickerMobile'
import Modal from 'components/common/Modal/Modal'
import Selectbox from 'components/common/Selectbox/Selectbox'
import { RightArrow } from 'components/common/Svg/SvgIcon'
import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'react-feather'
import colors from 'styles/colors'
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { useTranslation } from 'next-i18next'
import { DateRangePicker } from 'react-date-range'

interface InsuranceFilterMobile {
    visible: boolean
    onClose: () => void
    assetsToken: any[]
    asset: string
    setAsset: (e: string) => void
    state: string
    setState: (e: string) => void
    optionsState: any[]
    date: any
    setDate: (e: any) => void
    period: string
    setPeriod: (e: string) => void
    renderContent: any
    formatOptionLabel: (e: any) => void
}

const InsuranceFilterMobile = (props: InsuranceFilterMobile) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const {
        visible,
        onClose,
        assetsToken,
        asset,
        setAsset,
        optionsState,
        formatOptionLabel,
        state,
        setState,
        date,
        setDate,
        period,
        setPeriod,
        renderContent,
    } = props

    useEffect(() => {
        setShowPicker(false)
    }, [visible])

    const [showPicker, setShowPicker] = useState<boolean>(false)
    const [time, setTime] = useState(date)

    const navigatorRenderer = (focusedDate: any, changeShownDate: any, props: any) => {
        return (
            <div className="flex items-center justify-between absolute px-4 w-full top-0">
                <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                    <ChevronLeft color={colors.gray.gray} size={20} />
                </div>
                <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                    <ChevronRight color={colors.gray.gray} size={20} />
                </div>
            </div>
        )
    }

    return (
        <Modal containerClassName="flex-col justify-end" isVisible={visible} onBackdropCb={onClose}>
            <div className="bg-white px-6 py-8">
                <div className="flex items-center justify-between pb-6">
                    {showPicker ? (
                        <div className="rotate-180 cursor-pointer" onClick={() => setShowPicker(false)}>
                            <RightArrow color={colors.txtPrimary} size={20} />
                        </div>
                    ) : (
                        <div />
                    )}
                    <X onClick={onClose} size={20} className="cursor-pointer" />
                </div>
                <div className="overflow-hidden relative ">
                    <div className={`${!showPicker ? 'translate-x-0' : '-translate-x-full absolute'} transition-all flex flex-col space-y-6`}>
                        <div className={`flex items-center justify-between`}>
                            <div className="text-xl leanding-8 font-semibold">Lọc kết quả theo</div>
                            <div className="text-red underline text-sm">Hoàn tác</div>
                        </div>
                        <Selectbox
                            value={asset}
                            onChange={(e: any) => setAsset(e.value)}
                            className="w-full md:col-span-1"
                            label={t('common:asset_type')}
                            placeholder={t('common:choose_asset_type')}
                            displayExpr="name"
                            valueExpr="symbol"
                            formatOptionLabel={formatOptionLabel}
                            options={assetsToken}
                            labelClassName="font-semibold"
                        />
                        <div>
                            <div className="text-sm font-semibold">{t('insurance_history:status')}</div>
                            <div className="flex items-center flex-wrap">
                                {optionsState.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setState(item?.value)}
                                        className={classnames('text-sm px-4 py-2 mt-4 mr-3 last:mr-0 bg-hover rounded-[300px] cursor-pointer', {
                                            'text-red bg-pink font-semibold': state === item?.value,
                                        })}
                                    >
                                        {item?.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div onClick={() => setShowPicker(true)}>
                            <DateRangePickerMobile
                                renderContent={renderContent}
                                className="md:col-span-2 lg:col-span-1"
                                value={date}
                                label="Period"
                                prefix={period}
                                onChange={(e: any) => setDate(e[date.key])}
                            />
                        </div>
                    </div>
                    <div className={`${showPicker ? 'translate-x-0 min-h-[360px]' : 'translate-x-full absolute'} transition-all`}>
                        {renderContent()}
                        <div className="date-range-picker flex justify-center !bg-white">
                            <DateRangePicker
                                className="relative h-full"
                                ranges={[date]}
                                months={1}
                                onChange={(e: any) => setDate(e[date.key])}
                                moveRangeOnFirstSelection={false}
                                direction="horizontal"
                                staticRanges={[]}
                                inputRanges={[]}
                                weekStartsOn={0}
                                rangeColors={[colors.red.red]}
                                editableDateInputs={true}
                                retainEndDateOnFirstSelection
                                navigatorRenderer={navigatorRenderer}
                                locale={language === 'vi' ? vi : en}
                            />
                        </div>
                    </div>
                </div>
                <Button variants="primary" className="w-full text-sm h-[3rem] mt-8">
                    Lọc
                </Button>
            </div>
        </Modal>
    )
}

export default InsuranceFilterMobile
