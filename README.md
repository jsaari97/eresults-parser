# eResults Parser

Unofficial HTML to JSON parser cloud function for eResults. Tested with eResults Lite 3 and 4.

![codecov](https://img.shields.io/codecov/c/github/jsaari97/eresults-parser.svg?style=flat)
![circleci](https://img.shields.io/circleci/project/github/jsaari97/eresults-parser/master.svg?style=flat)

## Features

- eResults Lite 3 and 4 support.
- Automatically detects if results or splits.
- Outputs easy to read JSON.

## Deploy

Transpile typescript into javascript and zip dist directory

```
$ npm run build
```

After that you can upload .zip file to your Google Cloud Function.

## API

- `/?url=<url-to-html>`

# The MIT License (MIT)

Copyright © `2019` `Jim Saari`

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
