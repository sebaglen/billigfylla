import { NextApiRequest, NextApiResponse } from "next"

const VIN_API_KEY = process.env.VINMONOPOLET_API_KEY
const FETCH_INTERVAL = 1000 * 60 * 10;

const alkisKalkis = (price: number, volume: number, alcoholContent: number) => {
    return price/(volume*alcoholContent/100);
}
const sortByAlkPerNOK = (alkoA: Alko, alkoB: Alko) => alkoA.alkPerNOK - alkoB.alkPerNOK;

let cachedAlkohyler: Alko[] = [];
let lastUpdated = Date.now();

const fetchAlko = (apiKey: string) => fetch('https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=100', { headers: {'Ocp-Apim-Subscription-Key': apiKey}})
.then(data => data.json())
.then((data: APIAlko[]) => {
    console.log('i fetched')
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
    }).sort(sortByAlkPerNOK);
    lastUpdated = Date.now();
    cachedAlkohyler = alkohyler;
    return alkohyler })

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!VIN_API_KEY) {
        res.status(401);
        return;
    }
    if (req.method === 'GET') {
        if(!cachedAlkohyler.length) {
            return fetchAlko(VIN_API_KEY).then(alkohyler =>
                res.status(200).json(alkohyler)
            )
        }

        if(Date.now() - lastUpdated > FETCH_INTERVAL) {
            fetchAlko(VIN_API_KEY)
        }

        res.status(200).json(cachedAlkohyler);
    }
}