import React from 'react';
import Button from '../../common/Button/Button';

type Props = {};

export default function Banner({}: Props) {
    return (
        <section
            id="Banner"
            className="text-center bg_banner_home flex flex-col items-center h-[18.75rem] justify-center bg_section1"
        >
            <div className="md:text-[3rem] md:leading-[3.875rem] font-bold">Đây là slogan</div>
            <div className="md:text-[3rem] md:leading-[3.875rem] font-bold text-redPrimary mb-4">
                của Nami Insurance
            </div>
            <Button variants="gradient" className="w-[223px] h-[36px] lg:h-[56px]">
                Kết nối ví
            </Button>
        </section>
    );
}
