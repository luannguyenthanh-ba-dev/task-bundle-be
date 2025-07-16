const validator = require('validator');

const { logger, ResponseHandler, StatusCodes } = require('../../utils');
const { verifyJWT } = require('./auth.jwt');
const { UsersService } = require('../users/users.service');

class AuthMiddleware {
  async verifyToken(req, res, next) {
    const token = req.headers?.authorization;
    if (!token || typeof token !== 'string' || token.length === 0) {
      logger.error('Not have authz token!!!');
      return ResponseHandler.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Not have authz token!!!'
      );
    }
    // Format: "Bearer token"
    const tokenData = token.split(' ');
    // Check format
    if (tokenData[0] !== 'Bearer') {
      return ResponseHandler.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Invalid Bearer token format!!!'
      );
    }
    // Check token
    try {
      const userInfo = verifyJWT(tokenData[1]);
      const user = await UsersService.findOne({ email: userInfo.email });
      if (!user) {
        return ResponseHandler.error(
          res,
          StatusCodes.FORBIDDEN,
          'Cannot process, Not found user!!!'
        );
      }
      // Check verified user
      if (!user.is_verified) {
        return ResponseHandler.error(
          res,
          StatusCodes.FORBIDDEN,
          'Not a verified user!!!'
        );
      }
      req.user = userInfo;
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.UNAUTHORIZED,
        error.message || 'Token is invalid or expired!'
      );
    }

    return next();
  }

  registerValidate(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object') {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to register new user !!!'
      );
    }
    const errors = [];

    if (!data.email || !validator.isEmail(data.email)) {
      errors.push('Missing or Invalid Email!');
    }

    if (
      !data.password ||
      typeof data.password !== 'string' ||
      !validator.isStrongPassword(data.password)
    ) {
      // Strong Password is: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]
      errors.push(
        'Not a strong password: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]!'
      );
    }

    if (
      !data.name ||
      typeof data.name !== 'string' ||
      !validator.isLength(data.name, { min: 1, max: 150 })
    ) {
      errors.push(
        'Not have name, or invalid type STRING, or over length 150 chars!'
      );
    }
    if (data.phone && !validator.isMobilePhone(data.phone, 'vi-VN')) {
      errors.push('Phone number must be vi-VN phone!');
    }

    if (data.job && !validator.isLength(data.job, { min: 1, max: 250 })) {
      errors.push('Job max length 250!');
    }

    if (
      data.position &&
      !validator.isLength(data.position, { min: 1, max: 250 })
    ) {
      errors.push('Position max length 250!');
    }

    if (
      data.address &&
      !validator.isLength(data.address, { min: 1, max: 500 })
    ) {
      errors.push('Address max length 500!');
    }

    if (
      data.university &&
      !validator.isLength(data.university, { min: 1, max: 250 })
    ) {
      errors.push('University max length 250!');
    }

    if (errors.length > 0) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'Invalid data input!',
        { data: errors }
      );
    }

    return next();
  }

  verifyUserValidate(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object') {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to verify new user !!!'
      );
    }
    const errors = [];

    if (!data.email || !validator.isEmail(data.email)) {
      errors.push('Missing or Invalid Email!');
    }

    if (
      !data.code ||
      !typeof data.code === 'number' ||
      data.code.toString().length !== 6
    ) {
      // Strong Password is: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]
      errors.push('Invalid verification code!');
    }

    if (errors.length > 0) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'Invalid data input!',
        { data: errors }
      );
    }

    return next();
  }

  loginValidate(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object') {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to login user !!!'
      );
    }
    const errors = [];

    if (!data.email || !validator.isEmail(data.email)) {
      errors.push('Missing or Invalid Email!');
    }

    if (
      !data.password ||
      typeof data.password !== 'string' ||
      !validator.isStrongPassword(data.password)
    ) {
      errors.push('Invalid password, cannot login!');
    }

    if (errors.length > 0) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'Invalid data input!',
        { data: errors }
      );
    }

    return next();
  }
}

module.exports = { AuthMiddleware: new AuthMiddleware() };
