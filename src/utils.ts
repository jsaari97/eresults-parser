/// <reference lib="dom" />

import * as iconv from 'iconv-lite';
import { decode } from 'html-entities';
import chardet from 'chardet';
import * as cheerio from 'cheerio';
import { RawScrapeData, Route } from './types';

export const detectEncoding = (input: Uint8Array): string => {
  const results = chardet.detect(input);
  return results ?? 'utf-8';
};

export const convertToUtf = (data: Uint8Array, encoding: string): string =>
  // iconv-lite types are broken
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decode(iconv.decode(data as any, encoding))
    .replace(/Ĺ/g, 'Å')
    .replace(/ĺ/g, 'å')
    .replace(/<br>/g, '\n');

export const fetchFile = async (url: string): Promise<Uint8Array | null> => {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();

  return new Uint8Array(arrayBuffer);
};

export const decideDocType = ({ pre }: RawScrapeData): 'results' | 'intervals' => {
  const parsed = pre.map((item) => item.replace(/\s/g, ''));
  const ratio = parsed.map((item) => (item.match(/(-|\[|\])/g) || []).length / item.length);

  return ratio.filter((r) => r > 0.1).length > ratio.length / 2 ? 'intervals' : 'results';
};

const createQueryAll =
  ($: cheerio.CheerioAPI) =>
  (selector: string): string[] =>
    $(selector)
      .map((_, el) => $(el).text())
      .toArray()
      .filter(Boolean);

export const scrape = (data: string): Promise<RawScrapeData | null> =>
  new Promise(async (resolve, reject) => {
    try {
      const $ = cheerio.load(data);
      const queryAll = createQueryAll($);

      const title = $('h2').text() || '';
      const routes = queryAll('h3, h3 a');
      const pre = queryAll('pre');

      return resolve({
        title,
        routes,
        pre,
      });
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
