const express = require('express');

const { BoardsValidator } = require('./boards.validator');
const { BoardsController } = require('./boards.controller');
const { AuthMiddleware } = require('../auth/auth.middleware');
const { BoardAuthz } = require('./boards.authz');

const router = express.Router();

router.post(
  '/v1/boards',
  AuthMiddleware.verifyToken,
  BoardsValidator.create,
  BoardsController.create
);

router.get(
  '/v1/boards/home-views',
  AuthMiddleware.verifyToken,
  BoardsController.homeView
);

router.put(
  '/v1/boards/:board_id',
  AuthMiddleware.verifyToken,
  BoardAuthz.verifyBoardAdmin,
  BoardsValidator.updateInfo,
  BoardsController.updateInfo
);

module.exports = { boardRouters: router };
