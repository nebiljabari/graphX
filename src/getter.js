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

function getMainFolderNameFromScriptValue(script = '') {
  if (!script) return '';

  const [folderName] = script
    .split('=')
    .join()
    .split(' ')
    .filter(value => value.includes('.js'))
    .map(value => value.split('/')[0]);

  return folderName;
}

/* eslint-disable-next-line complexity */
function getMainFolderName() {
  const { main, scripts } = readPackageDotJSON();

  const mainScripts = {
    main  : main ? main.split('/')[0] : '',
    start : getMainFolderNameFromScriptValue(scripts.start),
    dev   : getMainFolderNameFromScriptValue(scripts.dev)
  };

  const { start, dev } = mainScripts;

  // @note, should/can be improved
  if (main && mainScripts.main === start || mainScripts.main === dev)
    return mainScripts.main;
  else if (start === dev)
    return start;

  return start || dev;
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

  return JSON.parse(packageDotJSON);
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
  getMainFolderName,
  getURLsFromConfigFile,
  readConfigFile
};
