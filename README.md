# eResults Parser

Unofficial HTML to JSON parser for eResults. Tested with eResults Lite 3 and 4.

![codecov](https://img.shields.io/codecov/c/github/jsaari97/eresults-parser)
![circleci](https://img.shields.io/circleci/build/github/jsaari97/eresults-parser/master)

## Features

- eResults Lite 3 and 4 support.
- Automatically detects if results or splits.
- Outputs easy to read JSON.

## Usage

### Requests

```http
GET /?url=https://domain.test/index.html
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `url`     | `string` | **Required**. Url to html document. |

### Responses

The parser calculates automatically whether the document is invalid, a result- or sprint-document.

If an error occurs, the service responds with `500` and an error message, otherwise `200` with a JSON payload.

#### Result document response:

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

#### Splits document response:

```javascript
{
  "results": [{
    "participants": [{
      "increments": [
        {
          "rank": number,
          "time": string,
          "diff": number,
        } | null
      ],
      "name": string,
      "position": number | null,
      "splits": [
        {
          "rank": number,
          "time": string,
          "diff": number,
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

- Node.js version 18 or higher

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

## License

MIT
