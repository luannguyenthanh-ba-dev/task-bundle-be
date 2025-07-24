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

router.put(
  '/v1/boards/:board_id/invite-members',
  AuthMiddleware.verifyToken,
  BoardAuthz.verifyBoardAdmin,
  BoardsValidator.inviteMember,
  BoardsController.inviteMember
);

router.get(
  '/v1/boards/:board_id/accept-invites/:email',
  BoardsValidator.acceptInvite,
  BoardsController.acceptInvite
);

router.get(
  '/v1/boards/:board_id/members',
  AuthMiddleware.verifyToken,
  BoardAuthz.verifyBoardUser,
  BoardsValidator.getListBoardUsers,
  BoardsController.getListBoardUsers
);
module.exports = { boardRouters: router };
