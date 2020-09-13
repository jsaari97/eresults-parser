// tslint:disable:no-identical-functions
import { convertToUtf, decideDocType, mergeObj, fetchFile, constructRoute } from './utils';
import * as fs from 'fs';
import * as path from 'path';
import { RawScrapeData } from './types';

const loadMockData = (type: 'intervals' | 'results'): RawScrapeData =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, `__mocks__/${type}.json`), 'utf8'));

describe('convertToUtf', () => {
  it('should convert to uft-8', () => {
    expect(convertToUtf(Buffer.from('Tv&aring;'), 'ISO-8859-1')).toBe('Två');
  });
});

describe('decideDocType()', () => {
  it('should find interval type', () => {
    const mockData = loadMockData('intervals');
    expect(decideDocType(mockData)).toBe('intervals');
  });

  it('should find results type', () => {
    const mockData = loadMockData('results');
    expect(decideDocType(mockData)).toBe('results');
  });
});

describe('mergeObj()', () => {
  it('should return merged object array', () => {
    expect(mergeObj([{ a: 1 }], [{ b: 2 }])).toEqual([{ a: 1, b: 2 }]);
  });
});

describe('fetchFile()', () => {
  it('should fetch http', async () => {
    const res = await fetchFile('http://google.com/');
    expect(typeof res).toBeTruthy();
  });
  it('should fetch https', async () => {
    const res = await fetchFile('https://google.com/');
    expect(typeof res).toBeTruthy();
  });
});

describe('constructRoute()', () => {
  it('should return correct format', () => {
    expect(constructRoute('A 6,6 km, tilanne rasteilla, rastivälien ajat')).toEqual({
      length: 6.6,
      name: 'A',
    });

    expect(constructRoute('Rata-A 6,6 km, tilanne rasteilla, rastivälien ajat')).toEqual({
      length: 6.6,
      name: 'A',
    });

    expect(constructRoute('Bana A 6,6 km')).toEqual({
      length: 6.6,
      name: 'A',
    });

    expect(constructRoute('A-bana 6,6 km')).toEqual({
      length: 6.6,
      name: 'A',
    });

    expect(constructRoute('Bana A, hello world')).toEqual({
      length: null,
      name: 'A',
    });
  });
});
