const fs = require('fs-extra');
const path = require('path');

fs.removeSync('lib');
fs.mkdirSync('lib');

fs.copyFileSync(
  'stormlib/bin/StormLib/x64/ReleaseAS/StormLibRAS.lib',
  'lib/StormLibRAS.lib'
);
fs.copyFileSync(
  'stormlib/bin/StormLib_dll/x64/Release/StormLib.lib',
  'lib/StormLib.lib'
);

function copyHeaderFiles(sourceDir, destDir) {
  const items = fs
    .readdirSync(sourceDir)
    .map(name => path.join(sourceDir, name));
  items.forEach(item => {
    if (fs.statSync(item).isDirectory()) {
      const subDir = path.join(destDir, path.basename(item));
      fs.ensureDirSync(subDir);
      copyHeaderFiles(item, subDir);
    } else if (path.extname(item) === '.h' || path.extname(item) === '.hpp') {
      fs.copySync(item, path.join(destDir, path.basename(item)));
    }
  });
}
copyHeaderFiles('stormlib/src', 'lib/src');

// fs.copySync('stormlib/src', 'lib/src');
