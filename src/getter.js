const fs = require('fs');
const glob = require('glob');
const flat = require('flat');
const config = require('config');

function getFilesName(target = '') {
  const { options } = config.get('glob');

  return new Promise((resolve, reject) => {

    glob(`${target}`, options, (err, files) => {
      if (err)
        reject('not good dude !');

      resolve(files);
    });

  });
}

function getURLsFromConfigFile(file = {}) {
  const urls = [];
  const prefixe = 'http';
  const flatten = flat(file);

  for (const key in flatten) {
    const value = flatten[key];

    if (typeof value === 'string' && value.match(prefixe))
      urls.push({ [key]: value });
  }

  return urls;
}

function readPackageDotJSON() {
  const { required } = config.get('target');

  const packageDotJSON = fs.readFileSync(required, { encoding: 'utf8' });

  /* eslint-disable-next-line */
  console.log('PackageDotJSON', JSON.parse(packageDotJSON));
}

function readConfigFile(filesName = ['']) {
  const prefixes = {
    folder : 'conf',
    file   : 'dev',
  };

  // @note, limit to .json for the moment
  // @todo, need improvement (of course ;-)
  const suffixe = 'json';

  // @note, can there be more than one dev config ?
  // ex: config/dev1, config/dev2  if yes, need to redo
  const [target] = filesName.filter(name =>
    name.match(prefixes.folder) &&
    name.match(prefixes.file) &&
    name.match(suffixe)
  );

  if (!target) return;

  const devConfigFile = fs.readFileSync(target, { encoding: 'utf8' });

  return JSON.parse(devConfigFile);
}

module.exports = {
  getFilesName,
  getURLsFromConfigFile,
  readPackageDotJSON,
  readConfigFile
};
