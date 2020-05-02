/* eslint-disable no-console */
const { checkTargetValidity } = require('./check');
const {
  getFilesName,
  getMainFolderName,
  getURLsFromConfigFile,
  readConfigFile
} = require('./getter');

async function main() {
  try {
    const { error, message } = await checkTargetValidity();

    if (error)
      throw new Error(message);

    const filesName = await getFilesName('mock/**/*');

    const configFile = readConfigFile(filesName);

    if (configFile) {
      const urls = getURLsFromConfigFile(configFile);

      const mainFolderName = getMainFolderName();

      console.log({ mainFolderName });
      console.log({ urls });
    }

    console.log({ filesName });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/* eslint-disable-next-line no-process-exit */
main().catch(() => process.exit(1));
