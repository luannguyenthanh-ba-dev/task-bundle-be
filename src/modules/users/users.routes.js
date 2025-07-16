const express = require('express');

const router = express.Router();
const { UsersController } = require('./users.controller');
const { AuthMiddleware } = require('../auth/auth.middleware');
const { UsersValidator } = require('./user.validator');

router.get(
  '/v1/users/my-profiles',
  AuthMiddleware.verifyToken,
  UsersController.viewMyProfile
);

router.put(
  '/v1/users/my-profiles',
  AuthMiddleware.verifyToken,
  UsersValidator.updateMyProfile,
  UsersController.updateMyProfile
);

router.put(
  '/v1/users/passwords',
  AuthMiddleware.verifyToken,
  UsersValidator.changePassword,
  UsersController.changePassword
);

router.put(
  '/v1/users/forgot-passwords',
  UsersValidator.forgotPassword,
  UsersController.forgotPassword
);

router.put(
  '/v1/users/otp-passwords',
  UsersValidator.changePasswordWithOTP,
  UsersController.changePasswordWithOTP
);

router.get(
  '/v1/users/:user_id',
  UsersValidator.viewUserGeneralInfo,
  UsersController.viewUserGeneralInfo
);
module.exports = { userRouters: router };
