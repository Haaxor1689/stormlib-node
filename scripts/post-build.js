const fs = require('fs-extra');

fs.removeSync('dist');
fs.mkdirSync('dist');

if (fs.existsSync('build/Release/stormlib.node'))
  fs.copyFileSync('build/Release/stormlib.node', 'dist/stormlib.node');

if (fs.existsSync('stormlib/bin/StormLib_dll/x64/Release/StormLib.dll'))
  fs.copyFileSync(
    'stormlib/bin/StormLib_dll/x64/Release/StormLib.dll',
    'dist/StormLib.dll'
  );
