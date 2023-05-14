const fs = require('fs-extra');

if (!fs.existsSync('lib')) fs.mkdirSync('lib');

fs.copyFileSync(
  'stormlib/bin/StormLib/x64/ReleaseAS/StormLibRAS.lib',
  'lib/StormLibRAS.lib'
);
fs.copyFileSync(
  'stormlib/bin/StormLib_dll/x64/Release/StormLib.lib',
  'lib/StormLib.lib'
);
fs.copySync('stormlib/src', 'lib/src');

if (fs.existsSync('build/Release/stormlib.node'))
  fs.copyFileSync('build/Release/stormlib.node', 'stormlib.node');
