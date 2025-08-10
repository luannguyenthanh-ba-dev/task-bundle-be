const express = require('express');
const { AuthController } = require('./auth.controller');
const { AuthMiddleware } = require('./auth.middleware');
const { idempotencyInterceptor } = require('../idempotency/idempotency.middleware');

const router = express.Router();

router.post(
  '/v1/auth/registers',
  idempotencyInterceptor,
  AuthMiddleware.registerValidate,
  AuthController.register
);

router.put(
  '/v1/auth/verifications',
  AuthMiddleware.verifyUserValidate,
  AuthController.verifyUser
);

router.post(
  '/v1/auth/logins',
  AuthMiddleware.loginValidate,
  AuthController.login
);

router.post('/v1/auth/refresh-logins', AuthController.refreshLogin);

module.exports = { authRouters: router };
