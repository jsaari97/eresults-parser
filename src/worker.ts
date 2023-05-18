import { parseIntervals, parseResults } from './scrape';
import { convertToUtf, decideDocType, detectEncoding, fetchFile, scrape } from './utils';

declare global {
  interface CacheStorage {
    default: {
      put(request: Request | string, response: Response): Promise<undefined>;
      match(request: Request | string): Promise<Response | undefined>;
    };
  }
}

const handler: ExportedHandler = {
  async fetch(request, env, ctx): Promise<Response> {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET');
    headers.set('Content-Type', 'application/json');

    const reject = (message: string) => {
      return new Response(JSON.stringify({ error: message }), { headers, status: 500 });
    };

    const url = new URL(request.url);

    const queryUrl = url.searchParams.get('url') as string;

    if (!queryUrl) {
      return reject(`'url' query parameter is required`);
    }

    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    let response = await cache.match(cacheKey);

    if (!response) {
      const data = await fetchFile(queryUrl);

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

      const body =
        documentType === 'intervals' ? parseIntervals(scrapeData) : parseResults(scrapeData);

      response = new Response(JSON.stringify(body), { headers, status: 200 });

      response.headers.append('Cache-Control', `s-maxage=${15 * 60}`);

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }

    return response;
  },
};

export default handler;
