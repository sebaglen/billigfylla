import { NextApiRequest, NextApiResponse } from "next"

const VIN_API_KEY = process.env.VINMONOPOLET_API_KEY

const alkisKalkis = (price: number, volume: number, alcoholContent: number) => {
    return price/(volume*alcoholContent/100);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!VIN_API_KEY) {
        res.status(401);
        return;
    }
    if (req.method === 'GET') {
        fetch('https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=100', { headers: {'Ocp-Apim-Subscription-Key': VIN_API_KEY}})
        .then(data => data.json())
        .then((data: APIAlko[]) => {
            const alkohyler: Alko[] = data.map(alk => {
                const price = alk.prices[0]?.salesPrice;
                const name = alk.basic.productShortName;
                const volume = alk.basic.volume;
                const alcoholContent = alk.basic.alcoholContent;
                return {
                    price,
                    name, 
                    volume, 
                    alcoholContent,
                    alkPerNOK: alkisKalkis(price, volume, alcoholContent)
                }
            })
            res.status(200).json(alkohyler)
        })
    }
}