import classNames from 'classnames';
import React from 'react';

type Props = {};

export default function CategoryLP({}: Props) {
    return (
        <section id="CategoryLP">
            <div className="flex flex-col items-center ins_container">
                <div className="text-5xl leading-10 font-medium">Tính năng độc đáo</div>
                <div className="max-w-[623px] text-center mt-4 mb-9">
                    Cung cấp dịch vụ bảo hiểm phi tập trung tin cậy và minh bạch, giảm thiểu tối đa
                    rủi ro thất thoát trị giá tài sản của người dùng trước các biến động của thị
                    trường
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    {dataCategory.map((v, i) => (
                        <div
                            key={i}
                            className={classNames(
                                'border rounded-xl p-6 items-center flex-1',
                                i === 1 ? 'border-redPrimary' : 'border-divider'
                            )}
                        >
                            <img
                                src={v.image}
                                alt="category"
                                className="w-[120px] h-[120px] m-auto mt-[19px]"
                            />
                            <div className="text-2xl leading-[35px] mb-2 mt-[55px] text-redPrimary font-medium">
                                {v?.title}
                            </div>
                            <div>{v?.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
const dataCategory = [
    {
        image: '/images/category_01.png',
        title: 'Bảo hiểm giá trị tài sản',
        desc: 'Nami Insurance cung cấp dịch vụ bảo hiểm giá trị tài sản, giảm thiểu tối đa thiệt hại cho người dùng trước những biến động của thị trường',
        url: ''
    },
    {
        image: '/images/category_02.png',
        title: 'Tùy chọn bảo hiểm theo nhu cầu',
        desc: 'Người dùng có thể tùy chọn nhiều phương án bảo hiểm, dựa trên nhu cầu thực tế với các chỉ số chính của mỗi hợp đồng bảo hiểm như: Giá trị ký quỹ, Mức giá bảo hiểm, Thời hạn bảo hiểm, Đơn vị thanh toán và chi trả bảo hiểm...',
        url: ''
    },
    {
        image: '/images/category_03.png',
        title: 'Hỗ trợ đa dạng tài sản',
        desc: 'Sản phẩm bảo hiểm giá trị của Nami Insurance khả dụng với hầu hết các loại tài sản thông dụng, được nhiều người dùng nắm giữ như BTC, ETH, BNB...',
        url: ''
    }
];
