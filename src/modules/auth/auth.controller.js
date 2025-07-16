const { UsersService } = require('../users/users.service');
const {
  ResponseHandler,
  StatusCodes,
  hashPassword,
  comparePassword,
} = require('../../utils');
const { generateJWT, verifyRefreshJWT } = require('./auth.jwt');
const { sendVerificationEmail } = require('../email/email.service');

class AuthController {
  async register(req, res) {
    const data = req.body;
    const existEmail = await UsersService.findOne({ email: data.email });
    if (existEmail) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'Can not register, user email existed!!!'
      );
    }
    try {
      const hashed = await hashPassword(data.password);
      data.password = hashed;

      const user = await UsersService.create(data);

      // TODO: Send verification email
      sendVerificationEmail(user, user.verification.code);
      //

      return ResponseHandler.success(res, StatusCodes.CREATED, {
        success: true,
        email: user.email,
      });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Register user met Unknown Error!!!'
      );
    }
  }

  async verifyUser(req, res) {
    const data = req.body;
    try {
      const success = await UsersService.verifyUser(data.email, data.code);
      return ResponseHandler.success(res, StatusCodes.OK, { success });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Verify user met Unknown Error!!!'
      );
    }
  }

  async login(req, res) {
    const data = req.body;
    try {
      const user = await UsersService.findOne({
        email: data.email,
        is_verified: true,
      });
      if (!user) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found verified user, login fail!!!'
        );
      }

      const matched = await comparePassword(data.password, user.password);
      if (!matched) {
        return ResponseHandler.error(
          res,
          StatusCodes.UNAUTHORIZED,
          'Invalid password, login fail!!!'
        );
      }

      const tokens = generateJWT(user);
      return ResponseHandler.success(res, StatusCodes.CREATED, { ...tokens });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Login user met Unknown Error!!!'
      );
    }
  }

  async refreshLogin(req, res) {
    const data = req.body;
    if (!data?.refresh_token || !data?.refresh_token?.length === 0) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'Not have refresh token!!!'
      );
    }
    try {
      const decode = verifyRefreshJWT(data.refresh_token);
      const user = await UsersService.findOne({
        email: decode.email,
        is_verified: true,
      });
      if (!user) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found verified user, refresh token fail!!!'
        );
      }

      const tokens = generateJWT(user);
      return ResponseHandler.success(res, StatusCodes.CREATED, { ...tokens });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Refresh login user met Unknown Error!!!'
      );
    }
  }
}

module.exports = { AuthController: new AuthController() };
