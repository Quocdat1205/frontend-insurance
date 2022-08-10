import React from 'react';
import Button from 'components/common/Button/Button';

type Props = {};

export default function NewInsuarance({}: Props) {
    return (
        <section id="NewInsuarance" className="ins_container">
            <div className="text-2xl md:text-5xl leading-10 mb-9 font-medium">
                Tài sản bảo hiểm mới
            </div>
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {dataNewISR.map((v, i) => (
                    <div className="shadow-lv4 rounded-xl p-6 flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            <img className="h-[3rem]" src={v?.icon} />
                            <div className="font-medium md:text-[2rem] leading-8">
                                {`${v?.name} cover`}{' '}
                            </div>
                        </div>
                        <Button variants="outlined" className="w-full py-3 h-[3rem]">
                            Mua bảo hiểm
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}
const dataNewISR = [
    {
        icon: '/images/btc_icon.png',
        name: 'Bitcoin'
    },
    {
        icon: '/images/eth_icon.png',
        name: 'Ethereum'
    },
    {
        icon: '/images/bnb_icon.png',
        name: 'Binance'
    }
];
