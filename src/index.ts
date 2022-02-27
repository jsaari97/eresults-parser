import { Request, Response } from 'express';
import { fetchFile, detectEncoding, convertToUtf, scrape, decideDocType } from './utils';
import { parseResults, parseIntervals } from './scrape';

const cache: { [url: string]: string } = {};

export const handler = async (
  req: Request<unknown, unknown, unknown, { url?: string }>,
  res: Response
): Promise<void> => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');

  const reject = (message: string): void => {
    res.status(400).send(message).end();
  };

  const resolve = (body: string) => {
    res.status(200).type('application/json').send(body).end();
  };

  if (!req.query) {
    return reject('Request query is empty');
  }

  const { query } = req;

  if (!query.url) {
    return reject('Request url query is empty');
  }

  if (cache[query.url]) {
    return resolve(cache[query.url]);
  }

  const data = await fetchFile(query.url);
  if (!data) {
    return reject('Could not fetch HTML file from given url');
  }

  const encoding = detectEncoding(data);

  const decoded = convertToUtf(data, encoding);

  const scrapeData = await scrape(decoded);

  if (!scrapeData) {
    return reject('Could not retrieve information from html file');
  }

  const documentType = decideDocType(scrapeData);

  const responseBody = JSON.stringify(
    documentType === 'intervals' ? parseIntervals(scrapeData) : parseResults(scrapeData)
  );

  cache[query.url] = responseBody;

  resolve(responseBody);
};
