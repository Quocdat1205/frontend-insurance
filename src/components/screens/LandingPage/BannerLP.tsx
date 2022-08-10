import React from 'react';
import Button from 'components/common/Button/Button';

type Props = {};

export default function BannerLP({}: Props) {
    return (
        <section id="BannerLP">
            <div className="grid lg:grid-cols-5">
                <div className="lg:col-span-2 flex flex-col md:pl-20 w-full md:w-auto md:items-start items-center my-auto">
                    <div className="md:text-[3rem] md:leading-[3.875rem] font-bold">
                        ĐÂY LÀ SLOGAN
                    </div>
                    <div className="md:text-[3rem] md:leading-[3.875rem] font-bold text-redPrimary mb-4">
                        CỦA NAMI INSURANCE
                    </div>
                    <div className="flex gap-4">
                        <Button
                            variants="gradient"
                            className="w-15 px-6 h-[36px] box-border font-medium lg:h-[56px]"
                        >
                            Mua bảo hiểm
                        </Button>
                        <Button
                            variants="outlined"
                            className="py-4 px-6 h-[36px] box-border font-medium lg:h-[56px]"
                        >
                            Mua NAIN
                        </Button>
                    </div>
                </div>
                <div className="flex-1 lg:col-span-3">
                    <img className="hidden md:block" src="/images/banner_lp.png" alt="banner" />
                </div>
            </div>
        </section>
    );
}
