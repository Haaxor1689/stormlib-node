const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const run = (...args) =>
  new Promise((resolve, reject) => {
    const child = spawn(...args);
    child.stdout.on('data', data => process.stdout.write(data));
    child.stderr.on('data', data => process.stderr.write(data));
    child.on('error', err => reject(err));
    child.on('exit', code =>
      code === 0
        ? resolve()
        : reject(new Error(`Child process exited with code ${code}`))
    );
  });

const copyHeaderFiles = (sourceDir, destDir) => {
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
};

const buildWindows = async () => {
  console.log('Compiling stormlib for windows...');
  await run('msbuild', [
    '.\\stormlib\\StormLib_vs22.sln',
    '/t:StormLib;StormLib_dll',
    '/p:Configuration=ReleaseAS;BuildProjectReferences=false;Platform=x64'
  ]);

  console.log('Moving build artifacts...');
  fs.copyFileSync(
    'stormlib/bin/StormLib/x64/ReleaseAS/StormLibRAS.lib',
    'lib/StormLibRAS.lib'
  );
  fs.copyFileSync(
    'stormlib/bin/StormLib_dll/x64/Release/StormLib.lib',
    'lib/StormLib.lib'
  );

  copyHeaderFiles('stormlib/src', 'lib/src');
};

const buildLinux = async () => {
  console.log('Compiling stormlib for linux');
  await run('cmake', ['-DCMAKE_POSITION_INDEPENDENT_CODE=ON', '.'], {
    cwd: 'stormlib'
  });
  await run('make', [], { cwd: 'stormlib' });

  console.log('Moving build artifacts...');
  fs.copyFileSync('stormlib/libstorm.a', 'lib/libstorm.a');
  copyHeaderFiles('stormlib/src', 'lib/src');
};

if (!fs.existsSync('lib')) fs.mkdirSync('lib');

(process.platform === 'win32' ? buildWindows() : buildLinux())
  .then(() => console.log('Stormlib compile step successful!'))
  .catch(() => process.exit(-1));
