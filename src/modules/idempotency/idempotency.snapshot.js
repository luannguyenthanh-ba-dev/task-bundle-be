const { logger } = require('../../utils/logger.util');
const { IdempotencyService } = require('./idempotency.service');

// Generate a hook function handle capture response and save snapshot
const captureResponse = async (reqData, data) => {
  try {
    // Update data in of idempotency-key in Database
    await IdempotencyService.updateOne(
      reqData.headers?.['idempotency-key'],
      reqData.scope,
      data
    );
    // TODO
    // Update redis snapshot with TTL 24h
    /** For example:
      *
        redis.set(
          redisKey,
          JSON.stringify({
            request_hash: reqData.hash,
            scope: reqData.scope,
            status: data.status,
            headers: reqData.headers,
            response_status_code: data.response_status_code,
            response_message: data.response_message,
            response_body: data.response_body,
          }),
          'EX',
          60 * 60 * 24 // TTL 24h
        );
      *
      */

    return true;
  } catch (error) {
    logger.error(
      'Handle update idempotency data met error:',
      error.message || 'Internal Server Error!'
    );
    return false;
  }
};

module.exports = { captureResponse };
