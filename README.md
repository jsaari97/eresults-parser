# eResults Parser

Unofficial HTML to JSON parser for eResults. Tested with eResults Lite 3 and 4.

![codecov](https://img.shields.io/codecov/c/github/jsaari97/eresults-parser)
![circleci](https://img.shields.io/circleci/build/github/jsaari97/eresults-parser/master)

## Features

- eResults Lite 3 and 4 support.
- Automatically detects if results or splits.
- Outputs easy to read JSON.
- Serverless using lambda functions.

## Usage

### Requests

```http
GET /?url=https://domain.test/index.html
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `url` | `string` | **Required**. Url to html document. |

### Responses

The parser calculates automatically whether the document is invalid, a result- or sprint-document.

If an error occurs, the service responds with `400` and an error message, otherwise `200` with a JSON payload.


#### Result Document

```javascript
{
  "results": [{
    "participants": [{
      "association": string | null,
      "diff": number | null,
      "name": string,
      "position": number | null,
      "time": string | null
    }],
    "statistics": {
      "started": number,
      "exited": number,
      "disqualified": number
    },
    "route": {
      "length": number,
      "name": string
    }
  }],
  "routes": [{
    "length": number,
    "name": string
  }],
  "title": string
}
```

#### Splits Document

```javascript
{
  "results": [{
    "participants": [{
      "increments": [
        {
          rank: number,
          time: string,
          diff: number,
        } | null
      ],
      "name": string,
      "position": number | null,
      "splits": [
        {
          rank: number,
          time: string,
          diff: number,
        } | null
      ],
      "time": string | null
    }],
    "statistics": {
      "started": number,
      "exited": number,
      "disqualified": number
    },
    "route": {
      "length": number,
      "name": string
    }
  }],
  "routes": [{
    "length": number,
    "name": string
  }],
  "title": string
}
```

## Development

### Requirements

- Node.js version 10

Clone the repository and install the package dependencies using the following command:

```bash
$ npm install
```

### Unit Tests

Unit tests are written with Jest testing library.

To run tests locally, run the following command:

```bash
$ npm test
```

---
## The MIT License (MIT)

Copyright © `2019-2020 Jim Saari`

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
