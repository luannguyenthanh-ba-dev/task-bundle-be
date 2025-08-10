const { IdempotencyStatus } = require('./idempotency.const');
const { IdempotencyModel } = require('./idempotency.model');

class IdempotencyService {
  async create(data) {
    try {
      const result = await IdempotencyModel.create({ ...data });
      return result;
    } catch (error) {
      throw new Error(
        error.message || 'create Idempotency met: Internal Server Error!!!'
      );
    }
  }

  /**
   * findOne: find one Idempotency by filters
   * @param {*} filters.idempotency_key String
   * @param {*} filters.scope String
   * @param {*} filters.hashed_req String
   * @param {*} filters.status String
   * @returns result
   */
  async findOne(filters) {
    const query = {};
    if (filters.idempotency_key) {
      query.idempotency_key = filters.idempotency_key;
    }
    if (filters.scope) {
      query.scope = filters.scope;
    }
    if (filters.hashed_req) {
      query.hashed_req = filters.hashed_req;
    }
    if (
      filters.status &&
      Object.values(IdempotencyStatus).includes(filters.status)
    ) {
      query.status = filters.status;
    }
    try {
      const result = await IdempotencyModel.findOne(query);
      return result;
    } catch (error) {
      throw new Error(
        error.message || 'findOne Idempotency met: Internal Server Error!!!'
      );
    }
  }

  async updateOne(idempotencyKey, scope, data) {
    const dataUpdate = {};
    if (data.status) {
      dataUpdate.status = data.status;
    }
    if (data.response_status_code) {
      dataUpdate.response_status_code = data.response_status_code;
    }
    if (data.response_message) {
      dataUpdate.response_message = data.response_message;
    }
    if (data.response_body) {
      dataUpdate.response_body = data.response_body;
    }
    if (data.finished_at) {
      dataUpdate.finished_at = data.finished_at;
    }
    try {
      const result = await IdempotencyModel.findOneAndUpdate(
        { idempotency_key: idempotencyKey, scope },
        dataUpdate,
        { new: true }
      );
      return result;
    } catch (error) {
      throw new Error(
        error.message || 'updateOne Idempotency met: Internal Server Error!!!'
      );
    }
  }
}

module.exports = { IdempotencyService: new IdempotencyService() };
