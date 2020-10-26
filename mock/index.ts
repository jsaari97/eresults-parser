import { handler } from '../src';
import * as fs from 'fs';
import * as path from 'path';

const req: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  query: {
    url: 'https://www.okbotnia.fi/wp-content/uploads/2020/04/t20200709.html',
  },
};

const mockFn = (): unknown => res;

const res: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  end: mockFn,
  send: (data: string) => {
    if (!fs.existsSync(path.join(__dirname, '/data'))) {
      fs.mkdirSync(path.join(__dirname, '/data'));
    }

    fs.writeFileSync(
      path.join(__dirname, '/data/response.json'),
      JSON.stringify(JSON.parse(data), null, 2),
      'utf8'
    );

    return res;
  },
  set: mockFn,
  status: mockFn,
  type: mockFn,
};

handler(req, res).then(() => undefined);
