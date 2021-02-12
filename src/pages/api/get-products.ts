import { NextApiRequest, NextApiResponse } from "next"

const VIN_API_KEY = process.env.VINMONOPOLET_API_KEY

const alkisKalkis = (price: number, volume: number, alcoholContent: number) => {
    return price/(volume*alcoholContent/100);
}
const sortByAlkPerNOK = (alkoA: Alko, alkoB: Alko) => alkoA.alkPerNOK - alkoB.alkPerNOK;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!VIN_API_KEY) {
        res.status(401);
        return;
    }
    if (req.method === 'GET') {
        fetch('https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=6000', { headers: {'Ocp-Apim-Subscription-Key': VIN_API_KEY}})
        .then(data => data.json())
        .then((data: APIAlko[]) => {
            const alkohyler: Alko[] = data.filter(alk => alk.basic.alcoholContent > 0).map((alk): Alko => {
                const price = alk.prices[0]?.salesPrice;
                const name = alk.basic.productShortName;
                const volume = alk.basic.volume;
                const alcoholContent = alk.basic.alcoholContent;
                const productId = alk.basic.productId;
                return {
                    productId,
                    price,
                    name, 
                    volume, 
                    alcoholContent,
                    alkPerNOK: alkisKalkis(price, volume, alcoholContent)
                }
            }).sort(sortByAlkPerNOK)
            res.status(200).json(alkohyler)
        })
    }
}