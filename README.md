# StormLib Node

Node native module of [StormLib](https://github.com/ladislav-zezula/StormLib) C++ library.

## Usage

Install the package as a dependency:

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

Depending on your use case, you may need to explicitly include these files in your build/package script:

- `./node_modules/stormlib-node/dist/stormlib.node`
- `./node_modules/stormlib-node/dist/StormLib.dll` (Windows only)
