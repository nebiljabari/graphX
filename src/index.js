/* eslint-disable no-console */
const { checkTargetValidity } = require('./check');
const {
  getFilesName,
  getURLsFromConfigFile,
  //readPackageDotJSON,
  readConfigFile
} = require('./getter');

async function main() {
  try {
    const { error, message } = await checkTargetValidity();

    if (error)
      throw new Error(message);

    //readPackageDotJSON();

    const filesName = await getFilesName('mock/**/*');

    const configFile = readConfigFile(filesName);

    if (configFile) {
      const urls = getURLsFromConfigFile(configFile);

      console.log('URLS:', urls);
    }

    //console.log('files:', filesName);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/* eslint-disable-next-line no-process-exit */
main().catch(() => process.exit(1));
