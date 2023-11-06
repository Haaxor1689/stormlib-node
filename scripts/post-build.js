const fs = require('fs-extra');

fs.removeSync('dist');
fs.mkdirSync('dist');

if (fs.existsSync('build/Release/stormlib.node'))
  fs.copyFileSync('build/Release/stormlib.node', 'dist/stormlib.node');

if (fs.existsSync('lib/StormLib.dll'))
  fs.copyFileSync('lib/StormLib.dll', 'dist/StormLib.dll');

fs.removeSync('build');
