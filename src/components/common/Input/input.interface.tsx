export  type ICoin = {
    id: number,
    name: string,
    icon: string,
}

export type ISelectBox = {
    selectCoin: ICoin;
    setSelectedCoin: any;
    className: string;
    listCoin: ICoin[]
}
