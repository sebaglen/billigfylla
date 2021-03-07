interface Alko {
  name: string;
  volume: number;
  alcoholContent: number;
  price: number;
  alkPerNOK: number;
  productId: string;
  type: string;
}

interface APIAlko {
  basic: {
    productShortName: string;
    volume: number;
    alcoholContent: number;
    productId: string;
  };
  classification: {
    mainProductTypeName: string;
    subProductTypeName: string;
  };
  prices: {
    salesPrice: number;
  }[];
}
