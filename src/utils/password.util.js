const bcrypt = require('bcrypt');
const { logger } = require('./logger.util');
const { env } = require('./environment');

const saltRounds = parseInt(env.SALT_ROUNDS || '10', 10);

const hashPassword = async (password = '') => {
  if (!password || password.length === 0) {
    logger.error('Not have password, cannot hash!!!');
    throw new Error('Not have password, cannot hash!!!');
  }
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hPass = await bcrypt.hashSync(password, salt);

  return hPass;
};

const comparePassword = async (password = '', hPass = '') => {
  if (!password || password.length === 0) {
    logger.error('Not have password, cannot compare!!!');
    throw new Error('Not have password, cannot compare!!!');
  }
  if (!hPass || hPass.length === 0) {
    logger.error('Not have hashed password, cannot compare!!!');
    throw new Error('Not have hashed password, cannot compare!!!');
  }

  const isMatched = await bcrypt.compareSync(password, hPass);
  return isMatched;
};

module.exports = {
  hashPassword,
  comparePassword,
};
