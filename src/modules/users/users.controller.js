const moment = require('moment-timezone');

const { comparePassword, hashPassword, logger } = require('../../utils');
const {
  ResponseHandler,
  StatusCodes,
} = require('../../utils/response-handler.util');
const { UsersService } = require('./users.service');
const { sendOTPEmail } = require('../email/email.service');

class UsersController {
  async viewMyProfile(req, res) {
    const user = req.user;
    return ResponseHandler.success(res, StatusCodes.OK, user);
  }

  async updateMyProfile(req, res) {
    const user = req.user;
    const data = req.body;
    try {
      const updated = await UsersService.updateOne(user._id, data);
      return ResponseHandler.success(res, StatusCodes.OK, updated);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Update user profile met Unknown Error!!!'
      );
    }
  }

  async changePassword(req, res) {
    const user = req.user;
    const data = req.body;
    try {
      const existUser = await UsersService.findOne({
        _id: user._id,
      });
      if (!existUser) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found verified user, changePassword fail!!!'
        );
      }

      const matched = await comparePassword(data.password, existUser.password);
      if (!matched) {
        return ResponseHandler.error(
          res,
          StatusCodes.UNAUTHORIZED,
          'Invalid password, changePassword fail!!!'
        );
      }
      const newHPass = await hashPassword(data.new_password);
      const changed = await UsersService.changePassword(user._id, newHPass);

      return ResponseHandler.success(res, StatusCodes.OK, {
        success: changed,
      });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Change password user met Unknown Error!!!'
      );
    }
  }

  async forgotPassword(req, res) {
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
          'Not found verified user, forgotPassword fail!!!'
        );
      }
      const otp = await UsersService.generateOtp(user._id);

      // TODO: Send OTP Mail
      logger.info(`OTP:${otp.otp}`);
      sendOTPEmail(user, otp.otp);
      //

      return ResponseHandler.success(res, StatusCodes.OK, { success: true });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Forgot password user met Unknown Error!!!'
      );
    }
  }

  async changePasswordWithOTP(req, res) {
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
          'Not found verified user, changePasswordWithOTP fail!!!'
        );
      }
      //
      const otp = await UsersService.findOneUserOTP(user._id, data.otp);
      if (!otp) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Invalid OTP!!!'
        );
      }

      const current = moment().unix();
      if (otp.ttl - current < 0) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_IMPLEMENTED,
          'OTP is expired, please renew!!!'
        );
      }
      //
      const newHPass = await hashPassword(data.new_password);
      const changed = await UsersService.changePassword(user._id, newHPass);

      UsersService.removeOTP(user._id);

      return ResponseHandler.success(res, StatusCodes.OK, {
        success: changed,
      });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Change Password With OTP user met Unknown Error!!!'
      );
    }
  }

  async viewUserGeneralInfo(req, res) {
    const userID = req.params.user_id;
    try {
      const userInfo = await UsersService.findOne({
        _id: userID,
      });
      if (!userInfo) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found verified user, viewUserGeneralInfo fail!!!'
        );
      }
      const result = {
        _id: userInfo._id,
        email: userInfo.email,
        name: userInfo.name,
        phone: userInfo.phone || '',
        job: userInfo.job || '',
        position: userInfo.position || '',
        address: userInfo.address || '',
        university: userInfo.university || '',
        is_verified: userInfo.is_verified,
        created_at: userInfo.created_at,
        updated_at: userInfo.updated_at,
      };
      return ResponseHandler.success(res, StatusCodes.OK, result);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'View User General Info met Unknown Error!!!'
      );
    }
  }

  async closeMyAccount(req, res) {
    //
  }
}

module.exports = { UsersController: new UsersController() };
