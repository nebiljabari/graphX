const config = require('config');
const { getFilesName } = require('./getter');

async function checkTargetValidity() {
  const check = { error: true, message: '' };
  const { required } = config.get('target');

  const [requiredFile] = await getFilesName(required);

  if (!requiredFile) {
    check.message = `missing ${required}`;
    return check;
  }

  check.error = false;
  return check;
}

module.exports = {
  checkTargetValidity
};
