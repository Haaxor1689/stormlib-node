# StormLib Node

Node native module of [StormLib](https://github.com/ladislav-zezula/StormLib) C++ library built for Electron.

## Usage

Install package as a dependency:

```
npm i stormlib-node
```

Import in one of your main thread scripts:

```js
import { SFileOpenArchive } from 'stormlib-node';
```

You can also import and use enum values:

```js
import { STREAM_FLAG } from 'stormlib-node/dist/enums';

SFileOpenArchive('path/to/archive.mpq', STREAM_FLAG.READ_ONLY);
```

## Development

To build this package locally, you need a few prerequisites:

- `node-gyp` installed globally with (`npm i -g node-gyp`)
- version of Visual Studio with C++ compiler and `msbuild` installed an accessible globally

Then, after downloading this repository run:

```
npm install
npm run compile
npm run configure
```

Lastly, to build the module use command:

```
npm run build
```
