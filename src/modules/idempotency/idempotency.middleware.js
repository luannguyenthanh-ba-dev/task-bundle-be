const crypto = require('crypto');
const { ResponseHandler, StatusCodes } = require('../../utils');
const {
  IdempotencyMethods,
  IdempotencyStatus,
} = require('./idempotency.const');
const { IdempotencyService } = require('./idempotency.service');

const hashRequest = (req) => {
  const data = JSON.stringify({
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  const hashed = crypto.createHash('sha256').update(data).digest('hex');
  return hashed;
};

const idempotencyInterceptor = async (req, res, next) => {
  // Only support idempotency for POST - PUT - PATCH - DELETE
  if (!IdempotencyMethods.includes(req.method)) {
    return next();
  }
  // Check idempotency key
  const idempotencyKey = req.headers?.['idempotency-key'];
  console.log('1-idempotencyKey', idempotencyKey);
  if (!idempotencyKey) {
    return ResponseHandler.error(
      res,
      StatusCodes.BAD_REQUEST,
      'Not have idempotency key!!!'
    );
  }
  /**
   * Prepare idempotency data:
   * - Request method
   * - Request path
   * => Generate scope of key
   */
  const scope = `${req.method}:${req.baseUrl}${req.path}`;
  req.scope = scope;
  console.log('2-scope', scope);
  // Hash the request data
  const hashedReq = hashRequest(req);
  req.hash = hashedReq;
  console.log('3-hashedReq', hashedReq);

  // TODO:
  // Quick verify idempotency by Redis Cache
  //

  try {
    // Handle idempotency key with DB storage -> exclude race condition multi-instance!!!
    const existed = await IdempotencyService.findOne({
      idempotency_key: idempotencyKey,
      scope,
    });
    console.log('4-existed', existed);

    if (existed) {
      // If the idempotency-key is reused with different payload:
      if (existed.hashed_req !== hashedReq) {
        return ResponseHandler.error(
          res,
          StatusCodes.CONFLICT,
          'Idempotency-Key is reused with different payload!!!'
        );
      }
      // If the request is in-progress
      if (existed.status === IdempotencyStatus.INPROGRESS) {
        return ResponseHandler.error(
          res,
          425,
          'Your request is in-progress please wait!!!'
        );
      }
      // If the request is processed and result = failed
      if (existed.status === IdempotencyStatus.FAILED) {
        return ResponseHandler.error(
          res,
          existed.response_status_code,
          existed.response_message,
          existed.response_body || {}
        );
      }
      // If the request is processed and result = completed
      return ResponseHandler.success(
        res,
        existed.response_status_code,
        existed.response_body,
        existed.response_message || 'Success!'
      );
    }
    // Create new Idempotency in database to ensure unique request!!!
    await IdempotencyService.create({
      idempotency_key: idempotencyKey,
      scope,
      hashed_req: hashedReq,
      status: IdempotencyStatus.INPROGRESS,
    });
  } catch (error) {
    return ResponseHandler.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'Unhandled Idempotency Data!!!'
    );
  }

  // TODO:
  // Generate new snapshot in redis to prevent parallel request with the same idempotency-key
  //

  // Finally assign res.isIdempotency = true to notice to all ResponseHandler methods handle capture response
  res.is_idempotency = true;
  res.req_data = req;
  return next();
};

module.exports = { idempotencyInterceptor };
