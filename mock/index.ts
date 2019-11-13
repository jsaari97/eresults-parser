import { handler } from '../src';
import * as fs from 'fs';
import * as path from 'path';

const req: any = {
  query: {
    url: 'http://www.okbotnia.fi/uploads/Motion2019/v20190621.html'
  }
};

const mockFn = (): any => res;

const res: any = {
  end: mockFn,
  send: (data: string) => {
    if (!fs.existsSync(path.resolve(__dirname, './data'))) {
      fs.mkdirSync(path.resolve(__dirname, './data'));
    }

    fs.writeFileSync(
      path.resolve(__dirname, './data/response.json'),
      JSON.stringify(JSON.parse(data), null, 2),
      'utf8'
    );

    return res;
  },
  set: mockFn,
  status: mockFn,
  type: mockFn
};

handler(req, res).then(() => undefined);
