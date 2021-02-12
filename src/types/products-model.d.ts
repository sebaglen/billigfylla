interface Alko {
    name: string;
    volume: number;
    alcoholContent: number;
    price: number;
    alkPerNOK: number;
    productId: string;
}

interface APIAlko {
    basic: {
        productShortName: string;
        volume: number;
        alcoholContent: number;
        productId: string;
    }
    prices: {
        salesPrice: number;
    }[]
} 