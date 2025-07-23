const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { ResponseHandler, StatusCodes, requestAPILogger } = require('./utils');
const { mongoDBConnect } = require('./database');
const { userRouters } = require('./modules/users/users.routes');
const { authRouters } = require('./modules/auth/auth.routes');
const { boardRouters } = require('./modules/boards/boards.routes');

class Application {
  async initial() {
    // Connect DB
    await mongoDBConnect();

    const app = express();
    // Base middleware
    app.use(cors({}));
    app.use(helmet());
    app.use(express.json());

    app.use(requestAPILogger);

    // Health Check
    app.get('/health', (req, res) => {
      ResponseHandler.success(res, StatusCodes.OK, this.healthCheck());
    });

    app.use(authRouters);
    app.use(userRouters);
    app.use(boardRouters);

    // Global not found handler
    app.use((req, res) => {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_FOUND,
        'Route not found'
      );
    });

    return app;
  }

  healthCheck() {
    return {
      status: StatusCodes.OK,
      message: 'Service healthy!',
    };
  }
}

module.exports = { Application: new Application() };
