const dotenv = require('dotenv');

const { logger } = require('./logger.util');

dotenv.config();
const env = (() => {
  try {
    const environment = process.env.environment ?? '';
    logger.debug(`environments/${environment}.env`);
    dotenv.config({ path: `environments/${environment}.env` });
    return process.env;
  } catch (error) {
    logger.error(`Init source met error with environment: ${error.message}`);
  }
})();

module.exports = { env };
