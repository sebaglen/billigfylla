interface Alko {
    name: string;
    volume: number;
    alcoholContent: number;
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