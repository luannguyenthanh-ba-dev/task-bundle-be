const dotenv = require('dotenv');
const { logger } = require('./utils');
const { Application } = require('./app');

dotenv.config();

const bootstrap = async () => {
  logger.info('Initial Service TaskBundle!!!');
  try {
    const environment = process.env.environment ?? '';
    logger.debug(`environments/${environment}.env`);
    dotenv.config({ path: `environments/${environment}.env` });
  } catch (error) {
    logger.error(`Init source met error with environment: ${error.message}`);
  }

  const PORT = process.env.PORT;

  const app = await Application.initial();

  app.listen(PORT, () => logger.info(`App is listening on PORT: ${PORT}`));
};

bootstrap();
