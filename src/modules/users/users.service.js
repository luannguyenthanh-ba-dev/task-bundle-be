const moment = require('moment-timezone');

const { UsersModel } = require('./users.model');
const { UsersOTPModel } = require('./users-otp.model');

class UsersService {
  /**
   * create: Create new user
   * @param {*} data Object
   * @returns user
   */
  async create(data) {
    try {
      const user = await UsersModel.create({ ...data });
      return user;
    } catch (error) {
      throw new Error(
        error.message || 'create user met: Internal Server Error!!!'
      );
    }
  }

  /**
   * findOne: Find a user by filters
   * @param {*} filters Object
   * @returns user
   */
  async findOne(filters = {}) {
    const query = { is_deleted: false }; // Always as default!!!

    if (filters._id && filters._id.length > 0) {
      query._id = filters._id;
    }
    if (filters.email) {
      query.email = filters.email;
    }
    if (filters.name) {
      // Regex with option i = case-insensitive
      query.name = { $regex: filters.name, $option: 'i' };
    }
    if (filters.phone) {
      query.phone = filters.phone;
    }
    if (filters.is_verified || filters.is_verified === false) {
      query.is_verified = filters.is_verified;
    }
    // Find data base on time filter:
    if (filters.from_time) {
      query.created_at = { $gte: filters.from_time };
    }
    if (filters.to_time) {
      query.created_at = { $lte: filters.to_time };
    }

    try {
      const user = await UsersModel.findOne(query);
      return user;
    } catch (error) {
      throw new Error(
        error.message || 'findOne user met: Internal Server Error!!!'
      );
    }
  }

  /**
   * findMany: Get a list of users by filters
   * @param {*} filters Object
   * @returns users
   */
  async findMany(filters) {
    const query = { is_deleted: false }; // Always as default!!!

    if (filters._id && filters._id.length > 0) {
      query._id = filters._id;
    }
    if (filters.email) {
      query.email = filters.email;
    }
    if (filters.name) {
      // Regex with option i = case-insensitive
      query.name = { $regex: filters.name, $option: 'i' };
    }
    if (filters.phone) {
      query.phone = filters.phone;
    }
    if (filters.is_verified || filters.is_verified === false) {
      query.is_verified = filters.is_verified;
    }
    // Find data base on time filter:
    if (filters.from_time) {
      query.created_at = { $gte: filters.from_time };
    }
    if (filters.to_time) {
      query.created_at = { $lte: filters.to_time };
    }

    try {
      const user = await UsersModel.find(query);
      return user;
    } catch (error) {
      throw new Error(
        error.message || 'findMany user met: Internal Server Error!!!'
      );
    }
  }

  /**
   * verifyUser: Verify account for new user
   * @param {*} email String
   * @param {*} code String
   * @returns Boolean
   */
  async verifyUser(email, code) {
    const user = await UsersModel.findOne({
      email,
      is_verified: false,
      is_deleted: false,
    });

    if (!user) {
      throw new Error('Not found unverified user!!!');
    }

    if (code !== user.verification.code) {
      throw new Error('Invalid verification code!!!');
    }

    const current = moment().unix();

    if (user.verification.ttl - current < 0) {
      throw new Error('Code is expired!!!');
    }

    try {
      const verified = await UsersModel.updateOne(
        { email },
        { is_verified: true }
      );

      if (verified.modifiedCount <= 0) {
        throw new Error('Verify user failed!!!');
      }
      return true;
    } catch (error) {
      throw new Error(
        error.message || 'verifyUser met: Internal Server Error!!!'
      );
    }
  }

  /**
   * updateOne: Update user general info
   * @param {*} _id String
   * @param {*} data Object
   * @returns user
   */
  async updateOne(_id, data) {
    const dataUpdate = {};
    if (data.name) {
      dataUpdate.name = data.name;
    }
    if (data.phone) {
      dataUpdate.phone = data.phone;
    }
    if (data.job) {
      dataUpdate.job = data.job;
    }
    if (data.position) {
      dataUpdate.position = data.position;
    }
    if (data.address) {
      dataUpdate.address = data.address;
    }
    if (data.university) {
      dataUpdate.university = data.university;
    }
    try {
      const updated = await UsersModel.findByIdAndUpdate(
        _id,
        {
          ...dataUpdate,
        },
        { new: true, select: '-password' }
      );

      return updated;
    } catch (error) {
      throw new Error(
        error.message || 'updateOne user met: Internal Server Error!!!'
      );
    }
  }

  /**
   * changePassword: Change user password
   * @param {*} _id String
   * @param {*} newPassword String
   * @returns Boolean
   */
  async changePassword(_id, newPassword) {
    try {
      const changed = await UsersModel.updateOne(
        { _id },
        { password: newPassword }
      );

      if (changed.modifiedCount <= 0) {
        throw new Error('Verify user failed!!!');
      }
      return true;
    } catch (error) {
      throw new Error(
        error.message || 'changePassword met: Internal Server Error!!!'
      );
    }
  }

  /**
   * generateOtp: Generate otp to renew password
   * @param {*} userID String
   * @returns otp
   */
  async generateOtp(userID) {
    try {
      const otp = await UsersOTPModel.findOneAndUpdate(
        { user: userID },
        {
          otp: Math.floor(100000 + Math.random() * 900000),
          ttl: moment().add(15, 'minutes').unix(),
        },
        { upsert: true, new: true }
      );
      return otp;
    } catch (error) {
      throw new Error(
        error.message || 'generateOtp met: Internal Server Error!!!'
      );
    }
  }

  /**
   * findOneUserOTP: Find user otp to verify change password
   * @param {*} userID String
   * @returns otp
   */
  async findOneUserOTP(userID, otp) {
    try {
      const rs = await UsersOTPModel.findOne({ user: userID, otp });
      return rs;
    } catch (error) {
      throw new Error(
        error.message || 'findOneUserOTP met: Internal Server Error!!!'
      );
    }
  }

  /**
   * removeOTP: After change password with otp -> remove user otp
   * @param {*} userID String
   * @returns Boolean
   */
  async removeOTP(userID) {
    try {
      const otp = await UsersOTPModel.deleteOne({ user: userID });
      return otp;
    } catch (error) {
      throw new Error(
        error.message || 'removeOTP met: Internal Server Error!!!'
      );
    }
  }
}

module.exports = { UsersService: new UsersService() };
