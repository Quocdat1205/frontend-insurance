import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import fetchApi from 'services/fetch-api';
import { API_GET_INFO_GENERAL } from 'services/api';
import { formatNumber } from 'utils/utils';
import _ from 'lodash';

type Props = {};
interface infoItem {
    _id: string;
    sum: Number;
}
interface infoGeneral {
    totalRefund: infoItem[];
    totalDeposit: infoItem[];
    totalUser: Number;
    payoutRatio: Number;
}
export default function Statistic({}: Props) {
    const [dataStatistic, setDataStatistic] = useState({} as infoGeneral);
    const router = useRouter();
    const { totalRefund, totalDeposit, totalUser, payoutRatio } = dataStatistic!;
    const isLandingPage = router.pathname.includes('landing-page');
    const fetchStatistic = async () => {
        const res = await fetchApi({
            url: API_GET_INFO_GENERAL,
            options: { method: 'GET' }
        });
        setDataStatistic(res);
    };
    useEffect(() => {
        fetchStatistic();
    }, []);
    return (
        <section id="Statistic">
            {!isLandingPage && (
                <div className="ins_container text-2xl  md:text-5xl leading-10 font-medium mb-9">
                    Thống kê về Nami Insurance
                </div>
            )}

            <div
                className={classNames(
                    isLandingPage ? 'bg_statistic_1' : 'bg_statistic_2',
                    'flex flex-col justify-end items-center pt-12'
                )}
            >
                <div className="leading-6">Tổng tài sản được bảo hiểm (USDT)</div>
                <div className="text-5xl leading-10 text-redPrimary mt-2 mb-6 font-bold">
                    {formatNumber(200000000)}
                </div>
                <div className="grid md:grid-cols-4 gap-6 w-full ins_container">
                    {/* {dataStatistic.map((v, i) => (
                        <div
                            key={i}
                            className={classNames(
                                !isLandingPage && 'items-center justify-end',
                                'lg:col-span-1 sm:col-span-2 flex flex-col p-4 gap-2 bg-white border border-redPrimary rounded-lg  md:!rounded-b-none md:border-b-0'
                            )}
                        >
                            {!isLandingPage && <img className="h-[48px] mt-[5px]" src={v?.url} />}
                            <div className="leading-6 text-txtSecondary">{v?.title}</div>
                            <div className="leading-6 text-2xl font-bold ">{v?.value}</div>
                        </div>
                    ))} */}
                    <div
                        className={classNames(
                            !isLandingPage && 'items-center justify-end',
                            'lg:col-span-1 sm:col-span-2 flex flex-col p-4 gap-2 bg-white border border-redPrimary rounded-lg  md:!rounded-b-none md:border-b-0'
                        )}
                    >
                        {!isLandingPage && (
                            <img className="h-[48px] mt-[5px]" src="/images/statistic_1.png" />
                        )}
                        <div className="leading-6 text-txtSecondary">{'Tổng chi trả (USDT)'}</div>
                        <div className="leading-6 text-2xl font-bold ">
                            {formatNumber(_.first(totalRefund)?.sum) || 0}
                        </div>
                    </div>
                    <div
                        className={classNames(
                            !isLandingPage && 'items-center justify-end',
                            'lg:col-span-1 sm:col-span-2 flex flex-col p-4 gap-2 bg-white border border-redPrimary rounded-lg  md:!rounded-b-none md:border-b-0'
                        )}
                    >
                        {!isLandingPage && (
                            <img className="h-[48px] mt-[5px]" src="/images/statistic_2.png" />
                        )}
                        <div className="leading-6 text-txtSecondary">{'Tổng ký quỹ (USDT)'}</div>
                        <div className="leading-6 text-2xl font-bold ">
                            {formatNumber(_.first(totalDeposit)?.sum) || 0}
                        </div>
                    </div>
                    <div
                        className={classNames(
                            !isLandingPage && 'items-center justify-end',
                            'lg:col-span-1 sm:col-span-2 flex flex-col p-4 gap-2 bg-white border border-redPrimary rounded-lg  md:!rounded-b-none md:border-b-0'
                        )}
                    >
                        {!isLandingPage && (
                            <img className="h-[48px] mt-[5px]" src="/images/statistic_3.png" />
                        )}
                        <div className="leading-6 text-txtSecondary">{'Số người tham gia'}</div>
                        <div className="leading-6 text-2xl font-bold ">
                            {formatNumber(totalUser)}
                        </div>
                    </div>
                    <div
                        className={classNames(
                            !isLandingPage && 'items-center justify-end',
                            'lg:col-span-1 sm:col-span-2 flex flex-col p-4 gap-2 bg-white border border-redPrimary rounded-lg  md:!rounded-b-none md:border-b-0'
                        )}
                    >
                        {!isLandingPage && (
                            <img className="h-[48px] mt-[5px]" src="/images/statistic_4.png" />
                        )}
                        <div className="leading-6 text-txtSecondary">{'Tỷ lệ chi trả'}</div>
                        <div className="leading-6 text-2xl font-bold ">
                            {formatNumber(payoutRatio, 2)}%
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const dataStatistic = [
    {
        title: 'Tổng chi trả (USDT)',
        value: '10,000,000',
        url: '/images/statistic_1.png'
    },
    {
        title: 'Tổng chi trả (USDT)',
        value: '10,000,000',
        url: '/images/statistic_2.png'
    },
    {
        title: 'Tổng chi trả (USDT)',
        value: '10,000,000',
        url: '/images/statistic_3.png'
    },
    {
        title: 'Tổng chi trả (USDT)',
        value: '10,000,000',
        url: '/images/statistic_4.png'
    }
];
