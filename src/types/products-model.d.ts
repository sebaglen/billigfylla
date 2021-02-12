interface Alko {
    name: string;
    volume: number;
    alocholContent: number;
    price: number;
}

interface APIAlko {
    basic: {
        productShortName: string;
        volume: number;
        alcoholContent: number;
    }
    prices: {
        salesPrice: number;
    }[]
} 