const { StatusCodes } = require('http-status-codes');
const {
  IdempotencyStatus,
} = require('../modules/idempotency/idempotency.const');
const {
  captureResponse,
} = require('../modules/idempotency/idempotency.snapshot');

class ResponseHandler {
  success(res, statusCode = 200, data = {}, message = 'Success!') {
    // If idempotency response in controller we will handle capture
    if (res.is_idempotency) {
      captureResponse(res.req_data, {
        status: IdempotencyStatus.COMPLETED,
        response_status_code: statusCode,
        response_message: message,
        response_body: data,
      });
    }
    return res.status(statusCode).json({
      status: 'success',
      code: statusCode,
      message,
      data,
    });
  }

  error(res, statusCode = 500, message = 'Unexpected Error!', error = {}) {
    // If idempotency response in controller we will handle capture
    if (res.is_idempotency) {
      captureResponse(res.req_data, {
        status: IdempotencyStatus.FAILED,
        response_status_code: statusCode,
        response_message: message,
        response_body: error,
      });
    }
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message,
      error,
    });
  }
}

module.exports = { ResponseHandler: new ResponseHandler(), StatusCodes };
