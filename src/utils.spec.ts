// tslint:disable:no-identical-functions
import { convertToUtf, decideDocType, mergeObj, fetchFile, constructRoute, scrape } from './utils';
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

describe('scrape()', () => {
  it('should scrape result data', async () => {
    const data = `
      <HTML>
        <BODY>
          <BLOCKQUOTE>
            <H2>TITLE</H2>
            <HR>
            <BR>
            <H3>Bana A 5.1km</H3>

            <PRE>
            (Startade: 10, Avbröt: 0, Ej godkänd: 0)

              1. Lorem Ipsum                   AAA                                44:57          
              2. Lorem Ipsum                                                      47:09    +02:12
            </PRE>
            <H3>Bana B 3.9km</H3>

            <PRE>
            (Startade: 10, Avbröt: 0, Ej godkänd: 0)

              1. Lorem Ipsum                   AAAAAA                             36:05          
              2. Lorem Ipsum                   AAAAAA                             39:53    +03:48
            </PRE>
          </BLOCKQUOTE>
        </BODY>
      </HTML>
    `;

    const result = await scrape(data);

    expect(result).toMatchSnapshot();
  });

  it('should scrape interval data', async () => {
    const data = `
        <HTML>
        <BODY>
        <BLOCKQUOTE>
        <H2>TITLE</H2>
        <HR>
        <BR>
        <H3>Bana A 5.1km, ställning vid kontrollerna, mellantider</H3>
        
        <PRE>
                                          1. [031]   2. [032]   3. [034]   4. [035]   5. [036]   6. [037]   7. [038]   8. [039]   9. [040]  10. [041]  11. [042]  12. [046]  13. [100]  14. [096]   Resultat
        <span style="background:#f4f4f4;">   1. Lorem Ipsum           <span style="color:#ef0000">    1-01:43</span><span style="color:#0b00ef">    2-05:47</span><span style="color:#0b00ef">    2-10:19</span><span style="color:#ef0000">    1-13:40</span><span style="color:#ef0000">    1-14:32</span><span style="color:#0b00ef">    2-25:08</span><span style="color:#0b00ef">    2-27:16</span><span style="color:#0b00ef">    2-30:43</span><span style="color:#0b00ef">    2-32:27</span><span style="color:#ef0000">    1-38:24</span><span style="color:#ef0000">    1-40:06</span><span style="color:#ef0000">    1-41:19</span><span style="color:#ef0000">    1-44:03</span><span style="color:#ef0000">    1-44:57</span>      44:57
                                      <span style="color:#ef0000">    1-01:43</span><span style="color:#5149f1">    3-04:04</span><span style="color:#0b00ef">    2-04:32</span><span style="color:#ef0000">    1-03:21</span><span style="color:#ef0000">    1-00:52</span>    4-10:36<span style="color:#ef0000">    1-02:08</span><span style="color:#ef0000">    1-03:27</span><span style="color:#ef0000">    1-01:44</span><span style="color:#0b00ef">    2-05:57</span><span style="color:#0b00ef">    2-01:42</span><span style="color:#ef0000">    1-01:13</span><span style="color:#ef0000">    1-02:44</span><span style="color:#ef0000">    1-00:54</span>           
        </span><span style="background:#ffffff;">   2. Lorem Ipsum             <span style="color:#5149f1">    3-01:53</span><span style="color:#ef0000">    1-05:36</span><span style="color:#ef0000">    1-10:04</span><span style="color:#0b00ef">    2-14:04</span><span style="color:#0b00ef">    2-15:09</span><span style="color:#ef0000">    1-23:32</span><span style="color:#ef0000">    1-25:55</span><span style="color:#ef0000">    1-29:55</span><span style="color:#ef0000">    1-32:17</span><span style="color:#0b00ef">    2-39:21</span><span style="color:#0b00ef">    2-40:58</span><span style="color:#0b00ef">    2-42:43</span><span style="color:#0b00ef">    2-46:01</span><span style="color:#0b00ef">    2-47:09</span>      47:09
                                      <span style="color:#5149f1">    3-01:53</span><span style="color:#ef0000">    1-03:43</span><span style="color:#ef0000">    1-04:28</span>    5-04:00    5-01:05<span style="color:#ef0000">    1-08:23</span><span style="color:#0b00ef">    2-02:23</span><span style="color:#0b00ef">    2-04:00</span>    6-02:22    6-07:04<span style="color:#ef0000">    1-01:37</span>    9-01:45<span style="color:#5149f1">    3-03:18</span><span style="color:#5149f1">    3-01:08</span>           
        </span></PRE>
        <H3>Bana B 3.9km, ställning vid kontrollerna, mellantider</H3>
        
        <PRE>
                                          1. [031]   2. [032]   3. [034]   4. [035]   5. [033]   6. [040]   7. [041]   8. [042]   9. [046]  10. [100]  11. [096]   Resultat
        <span style="background:#ffffff;">   1. Lorem Ipsum           <span style="color:#0b00ef">    2-01:42</span><span style="color:#0b00ef">    2-06:19</span><span style="color:#0b00ef">    2-11:22</span><span style="color:#0b00ef">    2-16:05</span><span style="color:#0b00ef">    2-19:54</span><span style="color:#0b00ef">    2-22:42</span><span style="color:#ef0000">    1-28:17</span><span style="color:#ef0000">    1-29:44</span><span style="color:#ef0000">    1-31:14</span><span style="color:#ef0000">    1-35:00</span><span style="color:#ef0000">    1-36:05</span>      36:05
                                      <span style="color:#0b00ef">    2-01:42</span><span style="color:#0b00ef">    2-04:37</span><span style="color:#ef0000">    1-05:03</span>    7-04:43<span style="color:#0b00ef">    2-03:49</span><span style="color:#0b00ef">    2-02:48</span><span style="color:#ef0000">    1-05:35</span><span style="color:#ef0000">    1-01:27</span><span style="color:#ef0000">    1-01:30</span>    4-03:46<span style="color:#0b00ef">    2-01:05</span>           
        </span><span style="background:#f4f4f4;">   2. Lorem Ipsum              <span style="color:#ef0000">    1-01:32</span><span style="color:#ef0000">    1-05:26</span><span style="color:#ef0000">    1-10:37</span><span style="color:#ef0000">    1-14:46</span><span style="color:#ef0000">    1-18:16</span><span style="color:#ef0000">    1-20:58</span><span style="color:#0b00ef">    2-31:17</span><span style="color:#0b00ef">    2-33:24</span><span style="color:#0b00ef">    2-35:01</span><span style="color:#0b00ef">    2-38:46</span><span style="color:#0b00ef">    2-39:53</span>      39:53
                                      <span style="color:#ef0000">    1-01:32</span><span style="color:#ef0000">    1-03:54</span><span style="color:#0b00ef">    2-05:11</span><span style="color:#0b00ef">    2-04:09</span><span style="color:#ef0000">    1-03:30</span><span style="color:#ef0000">    1-02:42</span>   10-10:19<span style="color:#0b00ef">    2-02:07</span><span style="color:#0b00ef">    2-01:37</span><span style="color:#5149f1">    3-03:45</span><span style="color:#5149f1">    3-01:07</span>           
        </span></PRE>
        </BLOCKQUOTE>
        </BODY>
        </HTML>
    `;

    const result = await scrape(data);

    expect(result).toMatchSnapshot();
  });
});
