import * as iconv from 'iconv-lite';
import * as https from 'https';
import * as http from 'http';
import * as he from 'he';
import * as detectCharEncoding from 'detect-character-encoding';
import * as Xray from 'x-ray';
import { RawScrapeData, Route } from './types';

export const detectEncoding = (input: Buffer): string => {
  const results = detectCharEncoding(input);
  return results ? results.encoding : 'utf-8';
};

export const convertToUtf = (data: Buffer, encoding: string): string =>
  he.decode(iconv.decode(data, encoding))
    .replace(/Ĺ/g, 'Å')
    .replace(/ĺ/g, 'å')
    .replace(/<br>/g, '\n');

export const fetchFile = (url: string): Promise<Buffer | null> => new Promise((resolve, reject) => {
  const request = url.match(/^https:/) ? https : http;
  request.get(url, (res) => {
    if (!res.headers['content-type'] || !res.headers['content-type'].match(/text\/html/)) {
      reject(null);
    }

    res.setEncoding('binary');
    const data: Uint8Array[] = [];

    res.on('data', (chunk: string) => {
      data.push(Buffer.from(chunk, 'binary'));
    }).on('end', () => {
      return resolve(Buffer.concat(data));
    }).on('error', reject);
  });
});

export const decideDocType = ({ pre }: RawScrapeData): 'results' | 'intervals' => {
  const parsed = pre.map((item) => item.replace(/\s/g, ''));
  const ratio = parsed.map((item) => (item.match(/(-|\[|\])/g) || []).length / item.length);

  return ratio.filter((r) => r > 0.1).length > ratio.length / 2 ? 'intervals' : 'results';
};

const x = Xray();

export const scrape = (data: string): Promise<RawScrapeData | null> => new Promise(async (resolve, reject) => {
  try {
    const result: RawScrapeData = await x(data, 'body', {
      pre: ['pre'],
      routes: ['h3', 'h3 a'],
      title: 'h2',
    });

    return resolve(result);
  } catch (e) {
    return reject(null);
  }
});

export const constructRoute = (route: string): Route => {
  const [
    name,
    length = null,
  ] = route
    .replace(',', '.')
    .replace(/(-|bana|rata|km|:)/gi, ' ')
    .trim()
    .split(/\s+/g);

  return {
    length: length && length.match(/\d+/g) ? Number(length) : null,
    name,
  };
};

export const mergeObj = <T1, T2>(a: T1[], b: T2[]): Array<T1 & T2> => a.map((one, i) => ({ ...one, ...b[i] }));
