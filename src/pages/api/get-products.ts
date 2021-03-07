import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const VIN_API_KEY = process.env.VINMONOPOLET_API_KEY;
const FETCH_INTERVAL = 1000 * 60 * 5;
const MAX_RESULTS = 30000;
const CACHE_FILE_NAME = 'alko-cache.json';

/* Type list:
 * Øl
 * Vin
 * Whisky
 * Annet
 * Sprit
 * Chæmpis
 * Rusbrus
 * Brennevin
 */

// For backup use if no subType is specified or recognized
const mainTypeAlcMap: Record<string, string> = {
  Svakvin: 'Vin',
  Sterkvin: 'Vin',
  Brennevin: 'Sprit',
  Øl: 'Øl',
};

// Prioritized types
const subTypeAlcMap: Record<string, string> = {
  Øl: 'Øl',
  Akevitt: 'Brennevin',
  Portvin: 'Vin',
  Vodka: 'Sprit',
  Druebrennevin: 'Brennevin',
  Whisky: 'Whisky',
  Likør: 'Likør',
  Genever: 'Sprit',
  Gin: 'Sprit',
  Bitter: 'Annet',
  Fruktbrennevin: 'Brennevin',
  Vermut: 'Sprit',
  'Aromatisert vin': 'Vin',
  'Brennevin, annet': 'Brennevin',
  Sherry: 'Vin',
  Rødvin: 'Vin',
  Hvitvin: 'Vin',
  'Perlende vin': 'Chæmpis',
  Rosévin: 'Vin',
  'Musserende vin': 'Chæmpis',
  Rom: 'Brennevin',
  'Sterkvin, annen': 'Vin',
  Fruktvin: 'Vin',
  Sider: 'Rusbrus',
  'Alkoholfri musserende, øvrig': 'Annet',
  Sake: 'Vin',
  Madeira: '',
  'Alkoholfri most': 'Annet',
  Tonic: 'Annet',
  Mjød: 'Øl',
  'Brennevin, nøytralt < 37,5 %': 'Brennevin',
  'Alkoholfri musserende vin': 'Annet',
  Ingefærøl: 'Øl',
  'Alkoholfri hvitvin': 'Annet',
  'Alkoholfritt øl': 'Annet',
  'Alkoholfri rødvin': 'Annet',
  Limonade: 'Annet',
  'Alkoholfri rosévin': 'Annet',
  Mocktails: 'Annet',
  Leskedrikk: 'Annet',
  'Alkoholfritt brennevin': 'Annet',
  'Alkoholfritt, øvrig': 'Annet',
};

const getAlcoholType = (type: string, subType: string) =>
  subTypeAlcMap[subType] || mainTypeAlcMap[type] || 'Annet';

const alkisKalkis = (price: number, volume: number, alcoholContent: number) =>
  price / ((volume * alcoholContent) / 100);
const sortByAlkPerNOK = (alkoA: Alko, alkoB: Alko) =>
  alkoA.alkPerNOK - alkoB.alkPerNOK;

let cachedAlkohyler: Alko[] = [];
let lastUpdated = Date.now();

const writeToCache = (alkohyler: Alko[]) => {
  const startTime = Date.now();
  if (alkohyler.length) {
    console.log('Writing to cache...');
    fs.writeFile(
      path.join(process.cwd(), CACHE_FILE_NAME),
      JSON.stringify(alkohyler, null, 2)
    )
      .catch((e) => console.error('Failed to write cache:', e))
      .finally(() => console.log('Write time:', Date.now() - startTime));
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

const fetchAlko = (apiKey: string, start: number, limit: number) =>
  fetch(
    `https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=${limit}&start=${start}`,
    { headers: { 'Ocp-Apim-Subscription-Key': apiKey } }
  )
    .then((data) => (data.status === 400 ? [] : data.json()))
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
            const type = getAlcoholType(
              alk.classification.mainProductTypeName,
              alk.classification.subProductTypeName
            );
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
      return alkohyler;
    });

const fetchAlkoParallel = (apiKey: string, partitions = 5) => {
  const startTime = Date.now();
  const partitionSize = Math.floor(MAX_RESULTS / partitions);
  return Promise.all(
    Array(partitions)
      .fill(1)
      .map((_, i) => fetchAlko(apiKey, partitionSize * i, partitionSize))
  )
    .then((values) => {
      const alkohyler = values
        .reduce((flat: Alko[], curr) => flat.concat(curr), [])
        .sort(sortByAlkPerNOK);
      lastUpdated = Date.now();
      cachedAlkohyler = alkohyler;
      writeToCache(alkohyler);
      console.log('Alkohyler in API:', alkohyler.length);
      return alkohyler;
    })
    .finally(() => console.log('Total fetch time:', Date.now() - startTime));
};

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
      return alcoholTypes.includes(alko.type);
    })
    .slice(offset, limit);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!VIN_API_KEY) {
    res.status(401).send('Authentication error. Try again later.');
    return;
  }
  if (req.method === 'GET') {
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const limit = (req.query.limit ? Number(req.query.limit) : 40) + offset;
    const searchQuery = req.query.searchQuery as string;
    const alcoholTypes =
      typeof req.query.alcoholTypes === 'string'
        ? [req.query.alcoholTypes]
        : req.query.alcoholTypes || [];

    console.log('Alkohyler in memory:', cachedAlkohyler.length);

    if (!cachedAlkohyler.length) {
      console.log('Reading from file...');
      readFromCache()
        .then((cache) => {
          console.log('Alkohyler in file:', cache.length);
          if (cache.length) {
            cachedAlkohyler = cache;
            console.log('Succesfully read from file. Re-fetching from API...');
            fetchAlkoParallel(VIN_API_KEY);
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
            return;
          }
          console.log('No results in file. Refecthing from API...');
          fetchAlkoParallel(VIN_API_KEY).then((alkohyler) =>
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
        })
        .catch((e) => {
          console.error('Error after restart', e);
          res.status(500).send('Internal server error');
        });
      return;
    }

    if (Date.now() - lastUpdated > FETCH_INTERVAL) {
      console.log('Outdated cache. Refetching from API...');
      fetchAlkoParallel(VIN_API_KEY);
    }

    res
      .status(200)
      .json(
        filterAlcohol(cachedAlkohyler, searchQuery, alcoholTypes, limit, offset)
      );
    return;
  }

  res.status(403).send('HTTP method not allowed');
}
