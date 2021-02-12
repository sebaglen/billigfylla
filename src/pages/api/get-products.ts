import { NextApiRequest, NextApiResponse } from "next"

const VIN_API_KEY = process.env.VINMONOPOLET_API_KEY

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!VIN_API_KEY) {
        res.status(401);
        return;
    }
    if (req.method === 'GET') {
        fetch('https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=100', { headers: {'Ocp-Apim-Subscription-Key': VIN_API_KEY}})
        .then(data => data.json())
        .then((data: APIAlko[]) => {
            const alkohyler: Alko[] = data.map(alk => ({ 
                price: alk.prices[0]?.salesPrice, 
                name: alk.basic.productShortName, 
                volume: alk.basic.volume, 
                alocholContent: alk.basic.alcoholContent 
            }))
            res.status(200).json(alkohyler)
        })
    }
}