const { logger, env } = require('./utils');
const { Application } = require('./app');

const bootstrap = async () => {
  logger.info('Initial Service TaskBundle!!!');

  const PORT = env.PORT;

  const app = await Application.initial();

  app.listen(PORT, () => logger.info(`App is listening on PORT: ${PORT}`));
};

bootstrap();
