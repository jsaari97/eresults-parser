import { Request, Response } from 'express';
import { RequestQuery } from './types';
import { fetchFile, detectEncoding, convertToUtf, scrape, decideDocType } from './utils';
import { parseResults, parseIntervals } from './scrape';

export const handler = async (req: Request, res: Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');

  const reject = (message: string): void =>
    res
      .status(400)
      .send(message)
      .end();

  if (!req.query) {
    return reject('Request query is empty');
  }

  const { query }: { query: RequestQuery } = req;

  if (!query.url) {
    return reject('Request url query is empty');
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

  res
    .status(200)
    .type('application/json')
    .send(responseBody)
    .end();
};
