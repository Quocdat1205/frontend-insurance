export  type ICoin = {
    id: number,
    name: string,
    icon: string,
    disable?: boolean;
}

export type ISelectBox = {
    selectCoin: ICoin;
    setSelectedCoin: any;
    className: string;
    listCoin: ICoin[]
}
