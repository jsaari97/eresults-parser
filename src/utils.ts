import iconv from 'iconv-lite';
import fetch from 'node-fetch';
import he from 'he';
import detectCharEncoding from 'detect-character-encoding';
import xray from 'x-ray';
import { RawScrapeData, Route } from './types';

export const detectEncoding = (input: Buffer): string => {
  const results = detectCharEncoding(input);
  return results ? results.encoding : 'utf-8';
};

export const convertToUtf = (data: Buffer, encoding: string): string =>
  he
    .decode(iconv.decode(data, encoding))
    .replace(/Ĺ/g, 'Å')
    .replace(/ĺ/g, 'å')
    .replace(/<br>/g, '\n');

export const fetchFile = async (url: string): Promise<Buffer | null> => {
  const res = await fetch(url);
  return await res.buffer();
};

export const decideDocType = ({ pre }: RawScrapeData): 'results' | 'intervals' => {
  const parsed = pre.map((item) => item.replace(/\s/g, ''));
  const ratio = parsed.map((item) => (item.match(/(-|\[|\])/g) || []).length / item.length);

  return ratio.filter((r) => r > 0.1).length > ratio.length / 2 ? 'intervals' : 'results';
};

const x = xray();

export const scrape = (data: string): Promise<RawScrapeData | null> =>
  new Promise(async (resolve, reject) => {
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
  const [name, length = null] = route
    .replace(',', '.')
    .replace(/(-|bana|rata|km|:)/gi, ' ')
    .trim()
    .split(/\s+/g);

  return {
    length: length && length.match(/\d+/g) ? Number(length) : null,
    name: name.replace(/[^a-zA-Z]/g, ''),
  };
};

export const mergeObj = <T1, T2>(a: T1[], b: T2[]): (T1 & T2)[] =>
  a.map((one, i) => ({ ...one, ...b[i] }));
