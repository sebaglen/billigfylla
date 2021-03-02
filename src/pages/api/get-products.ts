import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const VIN_API_KEY = process.env.VINMONOPOLET_API_KEY;
const FETCH_INTERVAL = 1000 * 60 * 5;
const MAX_RESULTS = 30000;
const CACHE_FILE_NAME = 'alko-cache.json';

const alcoholTypeMap: Record<string, string> = {
  Svakvin: 'Vin',
  Sterkvin: 'Vin',
  Brennevin: 'Sprit',
  Øl: 'Øl',
};
const getAlcoholType = (type: string) => alcoholTypeMap[type] || 'Annet';

const alkisKalkis = (price: number, volume: number, alcoholContent: number) =>
  price / ((volume * alcoholContent) / 100);
const sortByAlkPerNOK = (alkoA: Alko, alkoB: Alko) =>
  alkoA.alkPerNOK - alkoB.alkPerNOK;

let cachedAlkohyler: Alko[] = [];
let lastUpdated = Date.now();

const writeToCache = (alkohyler: Alko[]) => {
  if (alkohyler.length) {
    console.log('Writing to cache...');
    fs.writeFile(
      path.join(process.cwd(), CACHE_FILE_NAME),
      JSON.stringify(alkohyler, null, 2)
    ).catch((e) => console.error('Failed to write cache:', e));
  }
};

const readFromCache = (): Promise<Alko[]> =>
  fs
    .readFile(path.join(process.cwd(), CACHE_FILE_NAME))
    .then((rawCache) => JSON.parse(rawCache.toString()))
    .catch((e) => {
      console.error('Failed to read cache:', e);
      return [];
    });

const fetchAlko = (apiKey: string) =>
  fetch(
    `https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=${MAX_RESULTS}`,
    { headers: { 'Ocp-Apim-Subscription-Key': apiKey } }
  )
    .then((data) => data.json())
    .then((data: APIAlko[]) => {
      const alkohyler: Alko[] = data
        .filter((alk) => alk.basic.alcoholContent > 0)
        .map(
          (alk): Alko => {
            const price = alk.prices[0]?.salesPrice;
            const name = alk.basic.productShortName;
            const { volume } = alk.basic;
            const { alcoholContent } = alk.basic;
            const { productId } = alk.basic;
            const type = alk.classification.mainProductTypeName;
            return {
              productId,
              price,
              name,
              volume,
              alcoholContent,
              alkPerNOK: alkisKalkis(price, volume, alcoholContent),
              type,
            };
          }
        )
        .sort(sortByAlkPerNOK);
      lastUpdated = Date.now();
      cachedAlkohyler = alkohyler;
      writeToCache(alkohyler);
      return alkohyler;
    });

const filterAlcohol = (
  alkohyler: Alko[],
  searchQuery: string,
  alcoholTypes: string[],
  limit: number,
  offset: number
) =>
  alkohyler
    .filter((alko) => alko.name.match(new RegExp(searchQuery, 'gi')))
    .filter((alko) => {
      if (alcoholTypes.length === 0) return true;
      return alcoholTypes.includes(getAlcoholType(alko.type));
    })
    .slice(offset, limit);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!VIN_API_KEY) {
    res.status(401);
    return;
  }
  if (req.method === 'GET') {
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = (req.query.limit ? Number(req.query.limit) : 25) + offset;
    const searchQuery = req.query.searchQuery as string;
    const alcoholTypes =
      typeof req.query.alcoholTypes === 'string'
        ? [req.query.alcoholTypes]
        : req.query.alcoholTypes || [];

    console.log('Alkohyler in memory:', cachedAlkohyler.length);

    if (!cachedAlkohyler.length) {
      console.log('Reading from file...');
      readFromCache().then((cache) => {
        console.log('Alkohyler in file:', cache.length);
        if (cache.length) {
          cachedAlkohyler = cache;
          res
            .status(200)
            .json(
              filterAlcohol(
                cachedAlkohyler,
                searchQuery,
                alcoholTypes,
                limit,
                offset
              )
            );
          console.log('Refecthing from API... 1');
          fetchAlko(VIN_API_KEY);
        } else {
          console.log('Refecthing from API... 2');
          fetchAlko(VIN_API_KEY).then((alkohyler) =>
            res
              .status(200)
              .json(
                filterAlcohol(
                  alkohyler,
                  searchQuery,
                  alcoholTypes,
                  limit,
                  offset
                )
              )
          );
        }
      });
      return;
    }

    if (Date.now() - lastUpdated > FETCH_INTERVAL) {
      console.log('Refetching from API... 3');
      fetchAlko(VIN_API_KEY);
    }

    res
      .status(200)
      .json(
        filterAlcohol(cachedAlkohyler, searchQuery, alcoholTypes, limit, offset)
      );
  }
}
