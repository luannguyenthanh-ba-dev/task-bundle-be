const validator = require('validator');
const { StatusCodes, ResponseHandler } = require('../../utils');

class UsersValidator {
  updateMyProfile(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object' || Object.keys(data).length === 0) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to update user !!!'
      );
    }
    const errors = [];

    if (
      data.name &&
      (typeof data.name !== 'string' ||
        !validator.isLength(data.name, { min: 1, max: 150 }))
    ) {
      errors.push(
        'Update user: Name invalid type STRING, or over length 150 chars!'
      );
    }
    if (data.phone && !validator.isMobilePhone(data.phone, 'vi-VN')) {
      errors.push('Update user: Phone number must be vi-VN phone!');
    }

    if (data.job && !validator.isLength(data.job, { min: 1, max: 250 })) {
      errors.push('Update user: Job max length 250!');
    }

    if (
      data.position &&
      !validator.isLength(data.position, { min: 1, max: 250 })
    ) {
      errors.push('Update user: Position max length 250!');
    }

    if (
      data.address &&
      !validator.isLength(data.address, { min: 1, max: 500 })
    ) {
      errors.push('Update user: Address max length 500!');
    }

    if (
      data.university &&
      !validator.isLength(data.university, { min: 1, max: 250 })
    ) {
      errors.push('Update user: University max length 250!');
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

  changePassword(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object') {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to change password user !!!'
      );
    }
    const errors = [];

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
      !data.new_password ||
      typeof data.new_password !== 'string' ||
      !validator.isStrongPassword(data.new_password)
    ) {
      // Strong Password is: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]
      errors.push(
        'Not a strong new_password: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]!'
      );
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

  forgotPassword(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object') {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to forget password user !!!'
      );
    }
    const errors = [];

    if (!data.email || !validator.isEmail(data.email)) {
      errors.push('Missing or Invalid Email!');
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

  changePasswordWithOTP(req, res, next) {
    const data = req.body;
    if (!data || !typeof data === 'object') {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        'Not have data to change password with otp user !!!'
      );
    }
    const errors = [];

    if (!data.email || !validator.isEmail(data.email)) {
      errors.push('Missing or Invalid Email!');
    }

    if (
      !data.otp ||
      !typeof data.otp === 'number' ||
      data.otp < 100000 ||
      data.otp > 999999
    ) {
      errors.push('Missing or Invalid OTP!');
    }

    if (
      !data.new_password ||
      typeof data.new_password !== 'string' ||
      !validator.isStrongPassword(data.new_password)
    ) {
      // Strong Password is: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]
      errors.push(
        'Not a strong new_password: [minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1]!'
      );
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

  viewUserGeneralInfo(req, res, next) {
    const userID = req.params?.user_id;
    const errors = [];
    if (!userID || typeof userID !== 'string' || !validator.isMongoId(userID)) {
      errors.push('Missing or Invalid UserID!');
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

module.exports = { UsersValidator: new UsersValidator() };
