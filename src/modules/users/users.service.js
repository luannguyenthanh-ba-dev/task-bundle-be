const moment = require('moment-timezone');

const { UsersModel } = require('./users.model');

class UsersService {
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

    const verified = await UsersModel.updateOne(
      { email },
      { is_verified: true }
    );

    if (verified.modifiedCount <= 0) {
      throw new Error('Verify user failed, Internal Server Error!!!');
    }

    return true;
  }
}

module.exports = { UsersService: new UsersService() };
